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
  ewalletTypeColumnHelper,
  getAllEwalletTypes,
  type EwalletType,
  type EwalletTypeFilter,
  type GetEwalletTypesParams,
} from '@/services/ewalletType.service'
import type { OrderByParams } from '@/types/orderby.type'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'
import { ScrollArea } from '../ui/scroll-area'

interface EwalletTypeSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: EwalletType | null | undefined
  onSelect: (selected: EwalletType) => void
}

export function EwalletTypeSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: EwalletTypeSelectProps) {
  const [ewalletTypeParams, setEwalletTypeParams] =
    useState<GetEwalletTypesParams>({
      name: '',
      order_by: undefined,
      order_direction: undefined,
      page: 1,
    })
  const [filter, setFilter] = useState<EwalletTypeFilter>({
    name: '',
  })

  const { data: ewalletTypes, isLoading } = useQuery({
    queryKey: ['ewalletTypes', ewalletTypeParams],
    queryFn: () => getAllEwalletTypes(ewalletTypeParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setEwalletTypeParams({ ...ewalletTypeParams, page: newPage })
  }

  const handleOrderChange = (field: string) => {
    let newOrderByState: OrderByParams | undefined

    if (ewalletTypeParams.order_by === field) {
      if (ewalletTypeParams.order_direction === 'asc') {
        newOrderByState = { order_by: field, order_direction: 'desc' }
      } else if (ewalletTypeParams.order_direction === 'desc') {
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

    setEwalletTypeParams({ ...ewalletTypeParams, ...newOrderByState })
  }

  const handleFilterChange = (filter: EwalletTypeFilter) => {
    setEwalletTypeParams({ ...ewalletTypeParams, ...filter })
  }

  const handleSelectData = (ewalletType: EwalletType) => {
    onSelect(ewalletType)
    onOpenChange(false)
  }

  const columns = useMemo(
    () => [
      ewalletTypeColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      ewalletTypeColumnHelper.accessor('name', {
        header: () => (
          <Button variant="ghost" onClick={() => handleOrderChange('name')}>
            Nama
            {ewalletTypeParams.order_by === 'name' &&
            ewalletTypeParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : ewalletTypeParams.order_by === 'name' &&
              ewalletTypeParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      ewalletTypeColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const ewalletType = row.original
          return (
            <Button onClick={() => handleSelectData(ewalletType)}>Pilih</Button>
          )
        },
      }),
    ],
    [ewalletTypeParams],
  )

  const table = useReactTable({
    data: ewalletTypes?.items ?? [],
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
              'Pilih E-wallet...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih E-wallet</DialogTitle>
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
                  currentPage={ewalletTypes?.paginationData.currentPage ?? 1}
                  totalPages={ewalletTypes?.paginationData.totalPage ?? 1}
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
