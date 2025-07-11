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
  deviceColumnHelper,
  getAllDevices,
  type Device,
  type DeviceFilter,
  type GetDevicesParams,
} from '@/services/device.service'
import type { OrderByParams } from '@/types/orderby.type'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'
import { ScrollArea } from '../ui/scroll-area'

interface DeviceSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: Device | null | undefined
  onSelect: (selected: Device) => void
}

export function DeviceSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: DeviceSelectProps) {
  const [deviceParams, setDeviceParams] = useState<GetDevicesParams>({
    name: '',
    order_by: undefined,
    order_direction: undefined,
    page: 1,
  })
  const [filter, setFilter] = useState<DeviceFilter>({
    name: '',
  })

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices', deviceParams],
    queryFn: () => getAllDevices(deviceParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setDeviceParams({ ...deviceParams, page: newPage })
  }

  const handleOrderChange = (field: string) => {
    let newOrderByState: OrderByParams | undefined

    if (deviceParams.order_by === field) {
      if (deviceParams.order_direction === 'asc') {
        newOrderByState = { order_by: field, order_direction: 'desc' }
      } else if (deviceParams.order_direction === 'desc') {
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

    setDeviceParams({ ...deviceParams, ...newOrderByState })
  }

  const handleFilterChange = (filter: DeviceFilter) => {
    setDeviceParams({ ...deviceParams, ...filter })
  }

  const handleSelectData = (device: Device) => {
    onSelect(device)
    onOpenChange(false)
  }

  const columns = useMemo(
    () => [
      deviceColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      deviceColumnHelper.accessor('name', {
        header: () => (
          <Button variant="ghost" onClick={() => handleOrderChange('name')}>
            Nama
            {deviceParams.order_by === 'name' &&
            deviceParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : deviceParams.order_by === 'name' &&
              deviceParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      deviceColumnHelper.accessor('description', {
        header: 'Deskripsi',
        cell: (info) => {
          const desc = info.getValue()
          return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc
        },
      }),
      deviceColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const device = row.original
          return <Button onClick={() => handleSelectData(device)}>Pilih</Button>
        },
      }),
    ],
    [deviceParams],
  )

  const table = useReactTable({
    data: devices?.items ?? [],
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
              'Pilih Device...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih Device</DialogTitle>
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
                  currentPage={devices?.paginationData.currentPage ?? 1}
                  totalPages={devices?.paginationData.totalPage ?? 1}
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
