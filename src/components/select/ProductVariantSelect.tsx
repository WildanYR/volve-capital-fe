import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  productVariantColumnHelper,
  getAllProductVariants,
  type ProductVariant,
  type ProductVariantFilter,
  type GetProductVariantsParams,
} from '@/services/productVariant.service'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'
import { ProductSelect } from './ProductSelect'
import type { Product } from '@/services/product.service'

interface ProductVariantSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: ProductVariant | null | undefined
  onSelect: (selected: ProductVariant) => void
}

export function ProductVariantSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: ProductVariantSelectProps) {
  const [productVariantParams, setProductVariantParams] =
    useState<GetProductVariantsParams>({
      name: '',
      order_by: undefined,
      order_direction: undefined,
      page: 1,
    })
  const [filter, setFilter] = useState<ProductVariantFilter>({
    name: '',
    product_id: '',
  })

  const [isProductFilterOpen, setIsProductFilterOpen] = useState(false)
  const [productFilterSelected, setProductFilterSelected] = useState<Product>()

  const { data: productVariants, isLoading } = useQuery({
    queryKey: ['productVariants', productVariantParams],
    queryFn: () => getAllProductVariants(productVariantParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setProductVariantParams({ ...productVariantParams, page: newPage })
  }

  const handleFilterChange = (filter: ProductVariantFilter) => {
    setProductVariantParams({ ...productVariantParams, ...filter })
  }

  const handleSelectData = (productVariant: ProductVariant) => {
    onSelect(productVariant)
    onOpenChange(false)
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
      productVariantColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const productVariant = row.original
          return (
            <Button onClick={() => handleSelectData(productVariant)}>
              Pilih
            </Button>
          )
        },
      }),
    ],
    [productVariantParams],
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
    <Dialog open={isOpen} onOpenChange={(status) => onOpenChange(status)}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            {selectedItem?.name ? (
              <span className="flex-1 text-left font-normal">
                {selectedItem.name}
              </span>
            ) : (
              'Pilih Varian Produk...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih Varian Produk</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <TableLoading />
          ) : (
            <>
              <div className="flex gap-3">
                <Input
                  placeholder="Cari berdasarkan nama..."
                  value={filter.name}
                  onChange={(e) =>
                    setFilter({ ...filter, name: e.target.value })
                  }
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
              <TableData table={table} columns={columns} />
              <div className="flex items-center justify-end space-x-2 py-4">
                <Pagination
                  currentPage={productVariants?.paginationData.currentPage ?? 1}
                  totalPages={productVariants?.paginationData.totalPage ?? 1}
                  onPageChange={handlePaginationChange}
                />
              </div>
            </>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
