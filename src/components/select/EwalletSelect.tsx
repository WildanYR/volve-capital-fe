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
import {
  ewalletColumnHelper,
  getAllEwallets,
  type Ewallet,
  type EwalletFilter,
  type GetEwalletsParams,
} from '@/services/ewallet.service'
import type { OrderByParams } from '@/types/orderby.type'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'
import type { EwalletType } from '@/services/ewalletType.service'
import type { Simcard } from '@/services/simcard.service'
import type { Device } from '@/services/device.service'
import { EwalletTypeSelect } from './EwalletTypeSelect'
import { SimcardSelect } from './SimcardSelect'
import { DeviceSelect } from './DeviceSelect'
import { ScrollArea } from '../ui/scroll-area'

interface EwalletSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: Ewallet | null | undefined
  onSelect: (selected: Ewallet) => void
}

export function EwalletSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: EwalletSelectProps) {
  const [ewalletParams, setEwalletParams] = useState<GetEwalletsParams>({
    order_by: undefined,
    order_direction: undefined,
    page: 1,
    ewallet_type_id: '',
    simcard_id: '',
    device_id: '',
  })
  const [filter, setFilter] = useState<EwalletFilter>({
    ewallet_type_id: '',
    simcard_id: '',
    device_id: '',
  })
  const [isEwalletTypeFilterOpen, setIsEwalletTypeFilterOpen] = useState(false)
  const [isSimcardFilterOpen, setIsSimcardFilterOpen] = useState(false)
  const [isDeviceFilterOpen, setIsDeviceFilterOpen] = useState(false)

  const [ewalletTypeFilterSelected, setEwalletTypeFilterSelected] =
    useState<EwalletType>()
  const [simcardFilterSelected, setSimcardFilterSelected] = useState<Simcard>()
  const [deviceFilterSelected, setDeviceFilterSelected] = useState<Device>()

  const { data: ewallets, isLoading } = useQuery({
    queryKey: ['ewallets', ewalletParams],
    queryFn: () => getAllEwallets(ewalletParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setEwalletParams({ ...ewalletParams, page: newPage })
  }

  const handleOrderChange = (field: string) => {
    let newOrderByState: OrderByParams | undefined

    if (ewalletParams.order_by === field) {
      if (ewalletParams.order_direction === 'asc') {
        newOrderByState = { order_by: field, order_direction: 'desc' }
      } else if (ewalletParams.order_direction === 'desc') {
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

    setEwalletParams({ ...ewalletParams, ...newOrderByState })
  }

  const handleFilterChange = (filter: EwalletFilter) => {
    setEwalletParams({ ...ewalletParams, ...filter })
  }

  const handleSelectData = (ewallet: Ewallet) => {
    onSelect(ewallet)
    onOpenChange(false)
  }

  const clearFilter = () => {
    setFilter({ device_id: '', ewallet_type_id: '', simcard_id: '' })
    setEwalletTypeFilterSelected(undefined)
    setSimcardFilterSelected(undefined)
    setDeviceFilterSelected(undefined)
    handleFilterChange({ ...filter })
  }

  const handleEwalletTypeFilterSelected = (ewalletType: EwalletType) => {
    setEwalletTypeFilterSelected(ewalletType)
    setFilter({ ...filter, ewallet_type_id: ewalletType.id.toString() })
  }

  const handleSimcardFilterSelected = (simcard: Simcard) => {
    setSimcardFilterSelected(simcard)
    setFilter({ ...filter, simcard_id: simcard.id.toString() })
  }

  const handleDeviceFilterSelected = (device: Device) => {
    setDeviceFilterSelected(device)
    setFilter({ ...filter, device_id: device.id.toString() })
  }

  const columns = useMemo(
    () => [
      ewalletColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      ewalletColumnHelper.accessor((row) => row.ewallet_type.name, {
        id: 'ewallet',
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleOrderChange('ewallet_type.name')}
          >
            E-wallet
            {ewalletParams.order_by === 'ewallet_type.name' &&
            ewalletParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : ewalletParams.order_by === 'ewallet_type.name' &&
              ewalletParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      ewalletColumnHelper.accessor((row) => row.simcard.simcard_number, {
        id: 'simcard',
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleOrderChange('simcard.simcard_number')}
          >
            Simcard
            {ewalletParams.order_by === 'simcard.simcard_number' &&
            ewalletParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : ewalletParams.order_by === 'simcard.simcard_number' &&
              ewalletParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      ewalletColumnHelper.accessor((row) => row.device.name, {
        id: 'device',
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleOrderChange('device.name')}
          >
            Device
            {ewalletParams.order_by === 'device.name' &&
            ewalletParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : ewalletParams.order_by === 'device.name' &&
              ewalletParams.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      ewalletColumnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => info.getValue(),
      }),
      ewalletColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const ewallet = row.original
          return (
            <Button onClick={() => handleSelectData(ewallet)}>Pilih</Button>
          )
        },
      }),
    ],
    [ewalletParams],
  )

  const table = useReactTable({
    data: ewallets?.items ?? [],
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
            {selectedItem ? (
              <span className="flex-1 text-left font-normal">
                {selectedItem.ewallet_type.name} (
                {selectedItem.simcard.simcard_number})
              </span>
            ) : (
              'Pilih Ewallet...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih Ewallet</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <TableLoading />
          ) : (
            <ScrollArea>
              <div className="flex gap-3">
                <div>
                  <p className="text-xs font-bold">Filter Jenis E-Wallet</p>
                  <EwalletTypeSelect
                    isOpen={isEwalletTypeFilterOpen}
                    onOpenChange={setIsEwalletTypeFilterOpen}
                    selectedItem={ewalletTypeFilterSelected}
                    onSelect={handleEwalletTypeFilterSelected}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold">Filter Simcard</p>
                  <SimcardSelect
                    isOpen={isSimcardFilterOpen}
                    onOpenChange={setIsSimcardFilterOpen}
                    selectedItem={simcardFilterSelected}
                    onSelect={handleSimcardFilterSelected}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold">Filter Device</p>
                  <DeviceSelect
                    isOpen={isDeviceFilterOpen}
                    onOpenChange={setIsDeviceFilterOpen}
                    selectedItem={deviceFilterSelected}
                    onSelect={handleDeviceFilterSelected}
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
                  currentPage={ewallets?.paginationData.currentPage ?? 1}
                  totalPages={ewallets?.paginationData.totalPage ?? 1}
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
