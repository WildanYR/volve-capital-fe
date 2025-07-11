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
  platformColumnHelper,
  getAllPlatforms,
  type Platform,
  type PlatformFilter,
  type GetPlatformsParams,
} from '@/services/platform.service'
import type { OrderByParams } from '@/types/orderby.type'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'
import { ScrollArea } from '../ui/scroll-area'

interface PlatformSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: Platform | null | undefined
  onSelect: (selected: Platform) => void
}

export function PlatformSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: PlatformSelectProps) {
  const [platformParams, setPlatformParams] = useState<GetPlatformsParams>({
    name: '',
    order_by: undefined,
    order_direction: undefined,
    page: 1,
  })
  const [filter, setFilter] = useState<PlatformFilter>({
    name: '',
  })

  const { data: platforms, isLoading } = useQuery({
    queryKey: ['platforms', platformParams],
    queryFn: () => getAllPlatforms(platformParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setPlatformParams({ ...platformParams, page: newPage })
  }

  const handleOrderChange = (field: string) => {
    let newOrderByState: OrderByParams | undefined

    if (platformParams.order_by === field) {
      if (platformParams.order_direction === 'asc') {
        newOrderByState = { order_by: field, order_direction: 'desc' }
      } else if (platformParams.order_direction === 'desc') {
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

    setPlatformParams({ ...platformParams, ...newOrderByState })
  }

  const handleFilterChange = (filter: PlatformFilter) => {
    setPlatformParams({ ...platformParams, ...filter })
  }

  const handleSelectData = (platform: Platform) => {
    onSelect(platform)
    onOpenChange(false)
  }

  const columns = useMemo(
    () => [
      platformColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      platformColumnHelper.accessor('name', {
        header: () => (
          <Button variant="ghost" onClick={() => handleOrderChange('name')}>
            Nama
            {platformParams.order_by === 'name' &&
            platformParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : platformParams.order_by === 'name' &&
              platformParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      platformColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const platform = row.original
          return (
            <Button onClick={() => handleSelectData(platform)}>Pilih</Button>
          )
        },
      }),
    ],
    [platformParams],
  )

  const table = useReactTable({
    data: platforms?.items ?? [],
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
              'Pilih Platform...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih Platform</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <TableLoading />
          ) : (
            <ScrollArea>
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
                  currentPage={platforms?.paginationData.currentPage ?? 1}
                  totalPages={platforms?.paginationData.totalPage ?? 1}
                  onPageChange={handlePaginationChange}
                />
              </div>
            </ScrollArea>
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
