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
  deleteDevice,
  deviceColumnHelper,
  getAllDevices,
  GetDevicesParamsSchema,
  type Device,
  type DeviceFilter,
} from '@/services/device.service'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import { createSearchHandlers } from '@/lib/createSearchHandler'

export const Route = createFileRoute('/dashboard/device/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <DeviceTableComponent />
    </Suspense>
  ),
  validateSearch: GetDevicesParamsSchema,
})

function DeviceTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<DeviceFilter>({
    name: searchParam.name ?? '',
  })
  const { handleFilterChange, handleOrderChange, handlePaginationChange } =
    createSearchHandlers<DeviceFilter>(navigate)

  // Fetching data dengan TanStack Query
  const { data: devices } = useSuspenseQuery({
    queryKey: ['devices', searchParam],
    queryFn: () => getAllDevices(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      toast.success('Device berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus device: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (device: Device) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Device?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus device
          <span className="font-bold"> {device.name} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(device.id),
    })
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
            {searchParam.order_by === 'name' &&
            searchParam.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : searchParam.order_by === 'name' &&
              searchParam.order_direction === 'desc' ? (
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
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/device/$deviceId/edit"
                  params={{ deviceId: String(device.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(device)}
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
    data: devices?.items ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 w-full">
      <div className="flex items-center py-4 justify-between">
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
        <Button asChild>
          <Link to="/dashboard/device/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Device
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={devices.paginationData.currentPage}
          totalPages={devices.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
