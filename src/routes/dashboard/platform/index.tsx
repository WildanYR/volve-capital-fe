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
  deletePlatform,
  getAllPlatforms,
  GetPlatformsParamsSchema,
  platformColumnHelper,
  type Platform,
  type PlatformFilter,
} from '@/services/platform.service'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import { createSearchHandlers } from '@/lib/createSearchHandler'

export const Route = createFileRoute('/dashboard/platform/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <PlatformTableComponent />
    </Suspense>
  ),
  validateSearch: GetPlatformsParamsSchema,
})

function PlatformTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<PlatformFilter>({
    name: searchParam.name ?? '',
  })
  const { handleFilterChange, handleOrderChange, handlePaginationChange } =
    createSearchHandlers<PlatformFilter>(navigate)

  // Fetching data dengan TanStack Query
  const { data: platforms } = useSuspenseQuery({
    queryKey: ['platforms', searchParam],
    queryFn: () => getAllPlatforms(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
      toast.success('Platform berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus platform: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (platform: Platform) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Platform?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus platform
          <span className="font-bold"> {platform.name} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(platform.id),
    })
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
      platformColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const platform = row.original
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/platform/$platformId/edit"
                  params={{ platformId: String(platform.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(platform)}
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
    data: platforms?.items ?? [],
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
          <Link to="/dashboard/platform/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={platforms.paginationData.currentPage}
          totalPages={platforms.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
