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
  simcardColumnHelper,
  getAllSimcards,
  type Simcard,
  type SimcardFilter,
  type GetSimcardsParams,
} from '@/services/simcard.service'
import type { OrderByParams } from '@/types/orderby.type'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'
import { ScrollArea } from '../ui/scroll-area'

interface SimcardSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: Simcard | null | undefined
  onSelect: (selected: Simcard) => void
}

export function SimcardSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: SimcardSelectProps) {
  const [simcardParams, setSimcardParams] = useState<GetSimcardsParams>({
    order_by: undefined,
    order_direction: undefined,
    page: 1,
    simcard_number: '',
  })
  const [filter, setFilter] = useState<SimcardFilter>({
    simcard_number: '',
  })

  const { data: simcards, isLoading } = useQuery({
    queryKey: ['simcards', simcardParams],
    queryFn: () => getAllSimcards(simcardParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setSimcardParams({ ...simcardParams, page: newPage })
  }

  const handleOrderChange = (field: string) => {
    let newOrderByState: OrderByParams | undefined

    if (simcardParams.order_by === field) {
      if (simcardParams.order_direction === 'asc') {
        newOrderByState = { order_by: field, order_direction: 'desc' }
      } else if (simcardParams.order_direction === 'desc') {
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

    setSimcardParams({ ...simcardParams, ...newOrderByState })
  }

  const handleFilterChange = (filter: SimcardFilter) => {
    setSimcardParams({ ...simcardParams, ...filter })
  }

  const handleSelectData = (simcard: Simcard) => {
    console.log('simcard selected', simcard)
    onSelect(simcard)
    onOpenChange(false)
  }

  const columns = useMemo(
    () => [
      simcardColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      simcardColumnHelper.accessor('simcard_number', {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleOrderChange('simcard_number')}
          >
            Nama
            {simcardParams.order_by === 'simcard_number' &&
            simcardParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : simcardParams.order_by === 'simcard_number' &&
              simcardParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      simcardColumnHelper.accessor('location', {
        header: 'Penyimpanan',
        cell: (info) => {
          const desc = info.getValue()
          return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc
        },
      }),
      simcardColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const simcard = row.original
          return (
            <Button onClick={() => handleSelectData(simcard)}>Pilih</Button>
          )
        },
      }),
    ],
    [simcardParams],
  )

  const table = useReactTable({
    data: simcards?.items ?? [],
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
            {selectedItem?.simcard_number ? (
              <span className="flex-1 text-left font-normal">
                {selectedItem.simcard_number}
              </span>
            ) : (
              'Pilih Simcard...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih Simcard</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <TableLoading />
          ) : (
            <ScrollArea>
              <div className="flex gap-3">
                <Input
                  placeholder="Cari berdasarkan nama..."
                  value={filter.simcard_number}
                  onChange={(e) =>
                    setFilter({ simcard_number: e.target.value })
                  }
                />
                <Button onClick={() => handleFilterChange({ ...filter })}>
                  Terapkan
                </Button>
              </div>
              <TableData table={table} columns={columns} />
              <div className="flex items-center justify-end space-x-2 py-4">
                <Pagination
                  currentPage={simcards?.paginationData.currentPage ?? 1}
                  totalPages={simcards?.paginationData.totalPage ?? 1}
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
