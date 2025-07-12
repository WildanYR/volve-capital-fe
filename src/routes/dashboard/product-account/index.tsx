import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Edit,
  Trash,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react'
import { TableData } from '@/components/TableData'
import { Suspense, useMemo, useState } from 'react'
import { TableLoading } from '@/components/TableLoading'
import { useGlobalAlertDialog } from '@/provider/alert-dialog.provider'
import {
  deleteProductAccount,
  productAccountColumnHelper,
  getAllProductAccounts,
  GetProductAccountsParamsSchema,
  type ProductAccount,
  type ProductAccountFilter,
} from '@/services/productAccount.service'
import { Pagination } from '@/components/Pagination'
import { createSearchHandlers } from '@/lib/createSearchHandler'
import { ProductSelect } from '@/components/select/ProductSelect'
import type { Product } from '@/services/product.service'
import type { Email } from '@/services/email.service'
import { EmailSelect } from '@/components/select/EmailSelect'

export const Route = createFileRoute('/dashboard/product-account/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <ProductAccountTableComponent />
    </Suspense>
  ),
  validateSearch: GetProductAccountsParamsSchema,
})

function ProductAccountTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<ProductAccountFilter>({
    email_id: searchParam.email_id ?? '',
    product_id: searchParam.product_id ?? '',
  })

  const [isEmailFilterOpen, setIsEmailFilterOpen] = useState(false)
  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false)
  const [emailFilterSelected, setEmailFilterSelected] = useState<Email>()
  const [productFilterSelected, setProductFilterSelected] = useState<Product>()

  const { handleFilterChange, handlePaginationChange, handleOrderChange } =
    createSearchHandlers<ProductAccountFilter>(navigate)

  const { data: productAccounts } = useSuspenseQuery({
    queryKey: ['productaccounts', searchParam],
    queryFn: () => getAllProductAccounts(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productaccounts'] })
      toast.success('Akun Account berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus Akun Account: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (productAccount: ProductAccount) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Akun Account?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus akun
          <span className="font-bold">
            {' '}
            {productAccount.email.email} ({productAccount.product.name}){' '}
          </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(productAccount.id),
    })
  }

  const clearFilter = () => {
    const filterClear: ProductAccountFilter = { email_id: '', product_id: '' }
    handleFilterChange(filterClear)
    setFilter(filterClear)
    setProductFilterSelected(undefined)
    setEmailFilterSelected(undefined)
  }

  const handleEmailFilterSelected = (email: Email) => {
    setEmailFilterSelected(email)
    setFilter({ ...filter, email_id: email.id.toString() })
  }
  const handleProductFilterSelected = (product: Product) => {
    setProductFilterSelected(product)
    setFilter({ ...filter, product_id: product.id.toString() })
  }

  const columns = useMemo(
    () => [
      productAccountColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      productAccountColumnHelper.accessor((row) => row.email.email, {
        id: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      }),
      productAccountColumnHelper.accessor('account_password', {
        header: 'Password',
        cell: (info) => info.getValue(),
      }),
      productAccountColumnHelper.accessor((row) => row.product.name, {
        id: 'product',
        header: 'Produk',
        cell: (info) => info.getValue(),
      }),
      productAccountColumnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => info.getValue(),
      }),
      productAccountColumnHelper.accessor('batch_end_date', {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleOrderChange('batch_end_date')}
          >
            Berakhir
            {searchParam.order_by === 'batch_end_date' &&
            searchParam.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : searchParam.order_by === 'batch_end_date' &&
              searchParam.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue()?.toLocaleString(),
      }),
      productAccountColumnHelper.accessor('user_count', {
        header: 'Jumlah user',
        cell: (info) => info.getValue(),
      }),
      productAccountColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const productaccount = row.original
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/product-account/$productAccountId/edit"
                  params={{ productAccountId: String(productaccount.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(productaccount)}
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
    data: productAccounts?.items ?? [],
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
            <p className="text-xs font-bold">Filter Email</p>
            <EmailSelect
              isOpen={isEmailFilterOpen}
              onOpenChange={setIsEmailFilterOpen}
              selectedItem={emailFilterSelected}
              onSelect={handleEmailFilterSelected}
            />
          </div>
          <div>
            <p className="text-xs font-bold">Filter Produk</p>
            <ProductSelect
              isOpen={isProductFilterOpen}
              onOpenChange={setIsProductFilterOpen}
              selectedItem={productFilterSelected}
              onSelect={handleProductFilterSelected}
            />
          </div>
          <Button onClick={() => handleFilterChange({ ...filter })}>
            Terapkan
          </Button>
          <Button onClick={() => clearFilter()}>Clear</Button>
        </div>
        <Button asChild>
          <Link to="/dashboard/product-account/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Akun
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={productAccounts.paginationData.currentPage}
          totalPages={productAccounts.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
