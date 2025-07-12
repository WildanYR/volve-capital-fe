import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash, PlusCircle } from 'lucide-react'
import { TableData } from '@/components/TableData'
import { Suspense, useMemo, useState } from 'react'
import { TableLoading } from '@/components/TableLoading'
import { useGlobalAlertDialog } from '@/provider/alert-dialog.provider'
import {
  deleteTransaction,
  transactionColumnHelper,
  getAllTransactions,
  GetTransactionsParamsSchema,
  type Transaction,
  type TransactionFilter,
} from '@/services/transaction.service'
import { Pagination } from '@/components/Pagination'
import { createSearchHandlers } from '@/lib/createSearchHandler'
import type { ProductVariant } from '@/services/productVariant.service'
import { ProductVariantSelect } from '@/components/select/ProductVariantSelect'

export const Route = createFileRoute('/dashboard/transaction/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <TransactionTableComponent />
    </Suspense>
  ),
  validateSearch: GetTransactionsParamsSchema,
})

function TransactionTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<TransactionFilter>({
    product_variant_id: searchParam.product_variant_id ?? '',
  })

  const [isProductVariantFilterOpen, setIsProductVariantFilterOpen] =
    useState(false)
  const [productVariantFilterSelected, setProductVariantFilterSelected] =
    useState<ProductVariant>()

  const { handleFilterChange, handlePaginationChange } =
    createSearchHandlers<TransactionFilter>(navigate)

  // Fetching data dengan TanStack Query
  const { data: transactions } = useSuspenseQuery({
    queryKey: ['transactions', searchParam],
    queryFn: () => getAllTransactions(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus transaction: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (transaction: Transaction) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Transaction?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus
          <span className="font-bold"> Transaksi #{transaction.id} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(transaction.id),
    })
  }

  const clearFilter = () => {
    const filterClear: TransactionFilter = { product_variant_id: '' }
    handleFilterChange(filterClear)
    setFilter(filterClear)
    setProductVariantFilterSelected(undefined)
  }

  const handleProductVariantFilterSelected = (
    productVariant: ProductVariant,
  ) => {
    setProductVariantFilterSelected(productVariant)
    setFilter({ ...filter, product_variant_id: productVariant.id.toString() })
  }

  const columns = useMemo(
    () => [
      transactionColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      transactionColumnHelper.accessor('created_at', {
        header: 'Tanggal',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      transactionColumnHelper.accessor((row) => row.product_account_user.name, {
        id: 'product_account_user_name',
        header: 'Nama User',
        cell: (info) => info.getValue(),
      }),
      transactionColumnHelper.accessor(
        (row) => row.product_variant.product.name,
        {
          id: 'product_name',
          header: 'Produk',
          cell: (info) => info.getValue(),
        },
      ),
      transactionColumnHelper.accessor(
        (row) => row.product_account.email.email,
        {
          id: 'product_account_email',
          header: 'Email Akun',
          cell: (info) => info.getValue(),
        },
      ),
      transactionColumnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => info.getValue(),
      }),
      transactionColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const transaction = row.original
          return (
            <div className="flex gap-2">
              {/* <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/product-account-user/$transactionId/edit"
                  params={{
                    transactionId: String(transaction.id),
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button> */}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(transaction)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      }),
    ],
    [searchParam],
  )

  const table = useReactTable({
    data: transactions?.items ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 w-full">
      <div className="flex items-center py-4 justify-between">
        <div className="flex gap-3 items-end">
          <div>
            <p className="text-xs font-bold">Filter Varian Produk</p>
            <ProductVariantSelect
              isOpen={isProductVariantFilterOpen}
              onOpenChange={setIsProductVariantFilterOpen}
              selectedItem={productVariantFilterSelected}
              onSelect={handleProductVariantFilterSelected}
            />
          </div>
          <Button onClick={() => handleFilterChange({ ...filter })}>
            Terapkan
          </Button>
          <Button onClick={() => clearFilter()}>Clear</Button>
          <Button onClick={() => handleFilterChange({ ...filter })}>
            Terapkan
          </Button>
        </div>
        <Button asChild>
          <Link to="/dashboard/product-account-user/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Akun User
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={transactions.paginationData.currentPage}
          totalPages={transactions.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
