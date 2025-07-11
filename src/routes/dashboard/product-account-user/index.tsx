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
  deleteProductAccountUser,
  productAccountUserColumnHelper,
  getAllProductAccountUsers,
  GetProductAccountUsersParamsSchema,
  type ProductAccountUser,
  type ProductAccountUserFilter,
} from '@/services/productAccountUser.service'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import { createSearchHandlers } from '@/lib/createSearchHandler'
import type { Email } from '@/services/email.service'
import type { Product } from '@/services/product.service'
import { EmailSelect } from '@/components/select/EmailSelect'
import { ProductSelect } from '@/components/select/ProductSelect'

export const Route = createFileRoute('/dashboard/product-account-user/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <ProductAccountUserTableComponent />
    </Suspense>
  ),
  validateSearch: GetProductAccountUsersParamsSchema,
})

function ProductAccountUserTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<ProductAccountUserFilter>({
    name: searchParam.name ?? '',
    email_id: searchParam.email_id ?? '',
    product_id: searchParam.product_id ?? '',
  })

  const [isEmailFilterOpen, setIsEmailFilterOpen] = useState(false)
  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false)
  const [emailFilterSelected, setEmailFilterSelected] = useState<Email>()
  const [productFilterSelected, setProductFilterSelected] = useState<Product>()

  const { handleFilterChange, handlePaginationChange } =
    createSearchHandlers<ProductAccountUserFilter>(navigate)

  // Fetching data dengan TanStack Query
  const { data: productAccountUsers } = useSuspenseQuery({
    queryKey: ['productAccountUsers', searchParam],
    queryFn: () => getAllProductAccountUsers(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductAccountUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAccountUsers'] })
      toast.success('ProductAccountUser berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus productAccountUser: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (productAccountUser: ProductAccountUser) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus ProductAccountUser?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus productAccountUser
          <span className="font-bold"> {productAccountUser.name} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(productAccountUser.id),
    })
  }

  const clearFilter = () => {
    setFilter({ product_id: '', email_id: '', name: '' })
    setEmailFilterSelected(undefined)
    setProductFilterSelected(undefined)
    handleFilterChange({ ...filter })
  }

  const handleEmailFilterSelected = (email: Email) => {
    setEmailFilterSelected(email)
    setFilter({ ...filter, email_id: email.id.toString() })
  }
  const handleProductFilterSelected = (product: Product) => {
    setProductFilterSelected(product)
    setFilter({ ...filter, product_id: product.id.toString() })
  }

  const handleCopyTemplate = async (
    template: string | null,
    args: { email?: string; pass?: string; profil?: string; expired?: string },
  ) => {
    console.log({ args })
    let result = ''
    if (!template) {
      result = `Email: ${args.email}\nPassword: ${args.pass}`
    } else {
      result = template.replace(
        /{(\w+)}/g,
        (_, key) => args[key as keyof typeof args] ?? `{${key}}`,
      )
    }
    try {
      await navigator.clipboard.writeText(result)
      toast.success('Akun berhasil di copy')
    } catch (error) {
      console.log(error)
      toast.error('Akun gagal di copy')
    }
  }

  const columns = useMemo(
    () => [
      productAccountUserColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      productAccountUserColumnHelper.accessor('name', {
        header: 'Nama User',
        cell: (info) => info.getValue(),
      }),
      productAccountUserColumnHelper.accessor(
        (row) => row.product_account.email.email,
        {
          id: 'email',
          header: 'Email',
          cell: (info) => info.getValue(),
        },
      ),
      productAccountUserColumnHelper.accessor(
        (row) => row.product_account.account_password,
        {
          id: 'account_password',
          header: 'Password',
          cell: (info) => info.getValue(),
        },
      ),
      productAccountUserColumnHelper.accessor('account_profile', {
        header: 'Profil',
        cell: (info) => info.getValue(),
      }),
      productAccountUserColumnHelper.accessor(
        (row) => row.product_variant.product.name,
        {
          id: 'product_name',
          header: 'Produk',
          cell: (info) => info.getValue(),
        },
      ),
      productAccountUserColumnHelper.accessor(
        (row) => row.product_variant.name,
        {
          id: 'product_variant_name',
          header: 'Varian Produk',
          cell: (info) => info.getValue(),
        },
      ),
      productAccountUserColumnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => info.getValue(),
      }),
      productAccountUserColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const productAccountUser = row.original
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  handleCopyTemplate(
                    productAccountUser.product_variant.template,
                    {
                      email: productAccountUser.product_account.email.email,
                      pass: productAccountUser.product_account.account_password,
                      profil: productAccountUser.account_profile,
                      expired: productAccountUser.product_account.batch_end_date
                        ? new Date(
                            productAccountUser.product_account.batch_end_date,
                          ).toLocaleString()
                        : '',
                    },
                  )
                }
              >
                Copy
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(productAccountUser)}
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
    data: productAccountUsers?.items ?? [],
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
          <Input
            placeholder="Cari berdasarkan nama..."
            value={filter.name}
            onChange={(e) => setFilter({ name: e.target.value })}
          />
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
          currentPage={productAccountUsers.paginationData.currentPage}
          totalPages={productAccountUsers.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
