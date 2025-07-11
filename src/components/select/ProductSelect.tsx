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
  productColumnHelper,
  getAllProducts,
  type Product,
  type ProductFilter,
  type GetProductsParams,
} from '@/services/product.service'
import type { OrderByParams } from '@/types/orderby.type'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'

interface ProductSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: Product | null | undefined
  onSelect: (selected: Product) => void
}

export function ProductSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: ProductSelectProps) {
  const [productParams, setProductParams] = useState<GetProductsParams>({
    name: '',
    order_by: undefined,
    order_direction: undefined,
    page: 1,
  })
  const [filter, setFilter] = useState<ProductFilter>({
    name: '',
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', productParams],
    queryFn: () => getAllProducts(productParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setProductParams({ ...productParams, page: newPage })
  }

  const handleOrderChange = (field: string) => {
    let newOrderByState: OrderByParams | undefined

    if (productParams.order_by === field) {
      if (productParams.order_direction === 'asc') {
        newOrderByState = { order_by: field, order_direction: 'desc' }
      } else if (productParams.order_direction === 'desc') {
        newOrderByState = {
          order_by: undefined,
          order_direction: undefined,
        }
      } else {
        newOrderByState = { order_by: field, order_direction: 'asc' }
      }
    } else {
      newOrderByState = { order_by: field, order_direction: 'asc' }
    }

    setProductParams({ ...productParams, ...newOrderByState })
  }

  const handleFilterChange = (filter: ProductFilter) => {
    setProductParams({ ...productParams, ...filter })
  }

  const handleSelectData = (product: Product) => {
    onSelect(product)
    onOpenChange(false)
  }

  const columns = useMemo(
    () => [
      productColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      productColumnHelper.accessor('name', {
        header: () => (
          <Button variant="ghost" onClick={() => handleOrderChange('name')}>
            Nama
            {productParams.order_by === 'name' &&
            productParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : productParams.order_by === 'name' &&
              productParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      productColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const product = row.original
          return (
            <Button onClick={() => handleSelectData(product)}>Pilih</Button>
          )
        },
      }),
    ],
    [productParams],
  )

  const table = useReactTable({
    data: products?.items ?? [],
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
              'Pilih Produk...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih Produk</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <TableLoading />
          ) : (
            <div className="overflow-auto">
              <div className="flex gap-3">
                <Input
                  placeholder="Cari berdasarkan nama..."
                  value={filter.name}
                  onChange={(e) => setFilter({ name: e.target.value })}
                />
                <Button onClick={() => handleFilterChange({ ...filter })}>
                  Terapkan
                </Button>
              </div>
              <TableData table={table} columns={columns} />
              <div className="flex items-center justify-end space-x-2 py-4">
                <Pagination
                  currentPage={products?.paginationData.currentPage ?? 1}
                  totalPages={products?.paginationData.totalPage ?? 1}
                  onPageChange={handlePaginationChange}
                />
              </div>
            </div>
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
