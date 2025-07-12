import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Edit, Trash, PlusCircle } from 'lucide-react'
import { TableData } from '@/components/TableData'
import { Suspense, useMemo, useState } from 'react'
import { TableLoading } from '@/components/TableLoading'
import { useGlobalAlertDialog } from '@/provider/alert-dialog.provider'
import {
  deletePlatformProduct,
  platformProductColumnHelper,
  getAllPlatformProducts,
  GetPlatformProductsParamsSchema,
  type PlatformProduct,
  type PlatformProductFilter,
} from '@/services/platformProduct.service'
import { Pagination } from '@/components/Pagination'
import { createSearchHandlers } from '@/lib/createSearchHandler'
import { PlatformSelect } from '@/components/select/PlatformSelect'
import type { Platform } from '@/services/platform.service'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/dashboard/platform-product/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <PlatformProductTableComponent />
    </Suspense>
  ),
  validateSearch: GetPlatformProductsParamsSchema,
})

function PlatformProductTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<PlatformProductFilter>({
    product_name: searchParam.product_name ?? '',
    platform_id: searchParam.platform_id ?? '',
  })

  const [isPlatformFilterOpen, setIsPlatformFilterOpen] = useState(false)
  const [platformFilterSelected, setPlatformFilterSelected] =
    useState<Platform>()

  const { handleFilterChange, handlePaginationChange } =
    createSearchHandlers<PlatformProductFilter>(navigate)

  const { data: platformProducts } = useSuspenseQuery({
    queryKey: ['platformproducts', searchParam],
    queryFn: () => getAllPlatformProducts(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePlatformProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformproducts'] })
      toast.success('Produk Platform Product berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus Produk Platform Product: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (platformProduct: PlatformProduct) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Produk Platform Product?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus produk platform
          <span className="font-bold"> {platformProduct.product_name} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(platformProduct.id),
    })
  }

  const clearFilter = () => {
    const filterClear: PlatformProductFilter = {
      platform_id: '',
      product_id: '',
      product_name: '',
    }
    handleFilterChange(filterClear)
    setFilter(filterClear)
    setPlatformFilterSelected(undefined)
    // clear filter produk
  }

  const handlePlatformFilterSelected = (platform: Platform) => {
    setPlatformFilterSelected(platform)
    setFilter({ ...filter, platform_id: platform.id.toString() })
  }

  const columns = useMemo(
    () => [
      platformProductColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      platformProductColumnHelper.accessor('platform_product_id', {
        header: 'Platform Produk ID',
        cell: (info) => info.getValue(),
      }),
      platformProductColumnHelper.accessor('product_name', {
        header: 'Nama Produk',
        cell: (info) => info.getValue(),
      }),
      platformProductColumnHelper.accessor((row) => row.platform.name, {
        id: 'platform',
        header: 'Platform',
        cell: (info) => info.getValue(),
      }),
      platformProductColumnHelper.accessor(
        (row) => row.product_variant.product.name,
        {
          id: 'product',
          header: 'Produk',
          cell: (info) => info.getValue(),
        },
      ),
      platformProductColumnHelper.accessor((row) => row.product_variant.name, {
        id: 'product_variant',
        header: 'Varian Produk',
        cell: (info) => info.getValue(),
      }),
      platformProductColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const platformproduct = row.original
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/platform-product/$platformProductId/edit"
                  params={{ platformProductId: String(platformproduct.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(platformproduct)}
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
    data: platformProducts?.items ?? [],
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
            value={filter.product_name}
            onChange={(e) =>
              setFilter({ ...filter, product_name: e.target.value })
            }
          />
          <div>
            <p className="text-xs font-bold">Filter Produk</p>
            <PlatformSelect
              isOpen={isPlatformFilterOpen}
              onOpenChange={setIsPlatformFilterOpen}
              selectedItem={platformFilterSelected}
              onSelect={handlePlatformFilterSelected}
            />
          </div>
          <Button onClick={() => handleFilterChange({ ...filter })}>
            Terapkan
          </Button>
          <Button onClick={() => clearFilter()}>Clear</Button>
        </div>
        <Button asChild>
          <Link to="/dashboard/platform-product/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk Platform
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={platformProducts.paginationData.currentPage}
          totalPages={platformProducts.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
