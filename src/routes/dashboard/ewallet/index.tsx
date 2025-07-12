import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  ArrowUpDown,
  Edit,
  Trash,
  PlusCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { TableData } from '@/components/TableData'
import { Suspense, useMemo, useState } from 'react'
import { TableLoading } from '@/components/TableLoading'
import { useGlobalAlertDialog } from '@/provider/alert-dialog.provider'
import {
  deleteEwallet,
  ewalletColumnHelper,
  getAllEwallets,
  GetEwalletsParamsSchema,
  type Ewallet,
  type EwalletFilter,
} from '@/services/ewallet.service'
import { Pagination } from '@/components/Pagination'
import { createSearchHandlers } from '@/lib/createSearchHandler'
import { EwalletTypeSelect } from '@/components/select/EwalletTypeSelect'
import type { EwalletType } from '@/services/ewalletType.service'
import type { Simcard } from '@/services/simcard.service'
import type { Device } from '@/services/device.service'
import { SimcardSelect } from '@/components/select/SimcardSelect'
import { DeviceSelect } from '@/components/select/DeviceSelect'

export const Route = createFileRoute('/dashboard/ewallet/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <EwalletTableComponent />
    </Suspense>
  ),
  validateSearch: GetEwalletsParamsSchema,
})

function EwalletTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<EwalletFilter>({
    ewallet_type_id: searchParam.ewallet_type_id ?? '',
    simcard_id: searchParam.simcard_id ?? '',
    device_id: searchParam.device_id ?? '',
  })
  const [isEwalletTypeFilterOpen, setIsEwalletTypeFilterOpen] = useState(false)
  const [isSimcardFilterOpen, setIsSimcardFilterOpen] = useState(false)
  const [isDeviceFilterOpen, setIsDeviceFilterOpen] = useState(false)

  const [ewalletTypeFilterSelected, setEwalletTypeFilterSelected] =
    useState<EwalletType>()
  const [simcardFilterSelected, setSimcardFilterSelected] = useState<Simcard>()
  const [deviceFilterSelected, setDeviceFilterSelected] = useState<Device>()

  const { handleFilterChange, handleOrderChange, handlePaginationChange } =
    createSearchHandlers<EwalletFilter>(navigate)

  const { data: ewallets } = useSuspenseQuery({
    queryKey: ['ewallets', searchParam],
    queryFn: () => getAllEwallets(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEwallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallets'] })
      toast.success('Ewallet berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus ewallet: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (ewallet: Ewallet) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Ewallet?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus ewallet
          <span className="font-bold">
            {' '}
            {ewallet.ewallet_type.name} ({ewallet.simcard.simcard_number}){' '}
          </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(ewallet.id),
    })
  }

  const clearFilter = () => {
    const filterClear: EwalletFilter = {
      device_id: '',
      ewallet_type_id: '',
      simcard_id: '',
    }
    handleFilterChange(filterClear)
    setFilter(filterClear)
    setEwalletTypeFilterSelected(undefined)
    setSimcardFilterSelected(undefined)
    setDeviceFilterSelected(undefined)
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
            {searchParam.order_by === 'ewallet_type.name' &&
            searchParam.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : searchParam.order_by === 'ewallet_type.name' &&
              searchParam.order_direction === 'desc' ? (
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
            {searchParam.order_by === 'simcard.simcard_number' &&
            searchParam.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : searchParam.order_by === 'simcard.simcard_number' &&
              searchParam.order_direction === 'desc' ? (
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
            {searchParam.order_by === 'device.name' &&
            searchParam.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : searchParam.order_by === 'device.name' &&
              searchParam.order_direction === 'desc' ? (
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
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/ewallet/$ewalletId/edit"
                  params={{ ewalletId: String(ewallet.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(ewallet)}
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
    data: ewallets?.items ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 w-full">
      <div className="flex items-center py-4 justify-between">
        <div className="flex items-end gap-3">
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
        <Button asChild>
          <Link to="/dashboard/ewallet/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah E-wallet
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={ewallets.paginationData.currentPage}
          totalPages={ewallets.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
