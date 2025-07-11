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
  deleteProductVariant,
  productVariantColumnHelper,
  getAllProductVariants,
  GetProductVariantsParamsSchema,
  type ProductVariant,
  type ProductVariantFilter,
} from '@/services/productVariant.service'
import { Pagination } from '@/components/Pagination'
import { createSearchHandlers } from '@/lib/createSearchHandler'
import { ProductSelect } from '@/components/select/ProductSelect'
import type { Product } from '@/services/product.service'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/dashboard/product-variant/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <ProductVariantTableComponent />
    </Suspense>
  ),
  validateSearch: GetProductVariantsParamsSchema,
})

function ProductVariantTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<ProductVariantFilter>({
    name: searchParam.name ?? '',
    product_id: searchParam.product_id ?? '',
  })

  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false)
  const [productFilterSelected, setProductFilterSelected] = useState<Product>()

  const { handleFilterChange, handlePaginationChange } =
    createSearchHandlers<ProductVariantFilter>(navigate)

  const { data: productVariants } = useSuspenseQuery({
    queryKey: ['productvariants', searchParam],
    queryFn: () => getAllProductVariants(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productvariants'] })
      toast.success('Varian Produk Variant berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus Varian Produk Variant: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (productVariant: ProductVariant) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Varian Produk Variant?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus varian produk
          <span className="font-bold"> {productVariant.name} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(productVariant.id),
    })
  }

  const clearFilter = () => {
    setFilter({ product_id: '' })
    setProductFilterSelected(undefined)
    handleFilterChange({ ...filter })
  }

  const handleProductFilterSelected = (product: Product) => {
    setProductFilterSelected(product)
    setFilter({ ...filter, product_id: product.id.toString() })
  }

  const columns = useMemo(
    () => [
      productVariantColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      productVariantColumnHelper.accessor('name', {
        header: 'Nama',
        cell: (info) => info.getValue(),
      }),
      productVariantColumnHelper.accessor((row) => row.product.name, {
        id: 'product',
        header: 'Produk',
        cell: (info) => info.getValue(),
      }),
      productVariantColumnHelper.accessor('max_user', {
        header: 'User Maksimal',
        cell: (info) => info.getValue(),
      }),
      productVariantColumnHelper.accessor('duration_hour', {
        header: 'Durasi (jam)',
        cell: (info) => info.getValue(),
      }),
      productVariantColumnHelper.accessor('interval_hour', {
        header: 'Interval (jam)',
        cell: (info) => info.getValue(),
      }),
      productVariantColumnHelper.accessor('cooldown', {
        header: 'Cooldown (Menit)',
        cell: (info) => info.getValue(),
      }),
      productVariantColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const productvariant = row.original
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/product-variant/$productVariantId/edit"
                  params={{ productVariantId: String(productvariant.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(productvariant)}
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
    data: productVariants?.items ?? [],
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
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
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
          <Link to="/dashboard/product-variant/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Varian Produk
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={productVariants.paginationData.currentPage}
          totalPages={productVariants.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
