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
  deleteSimcard,
  getAllSimcards,
  GetSimcardsParamsSchema,
  simcardColumnHelper,
  type Simcard,
  type SimcardFilter,
} from '@/services/simcard.service'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import { createSearchHandlers } from '@/lib/createSearchHandler'

export const Route = createFileRoute('/dashboard/simcard/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <SimcardTableComponent />
    </Suspense>
  ),
  validateSearch: GetSimcardsParamsSchema,
})

function SimcardTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<SimcardFilter>({
    simcard_number: searchParam.simcard_number ?? '',
  })
  const { handleFilterChange, handleOrderChange, handlePaginationChange } =
    createSearchHandlers<SimcardFilter>(navigate)

  // Fetching data dengan TanStack Query
  const { data: simcards } = useSuspenseQuery({
    queryKey: ['simcards', searchParam],
    queryFn: () => getAllSimcards(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSimcard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simcards'] })
      toast.success('Simcard berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus simcard: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (simcard: Simcard) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Simcard?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus simcard
          <span className="font-bold"> {simcard.simcard_number} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(simcard.id),
    })
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
            Nomor Sim
            {searchParam.order_by === 'simcard_number' &&
            searchParam.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : searchParam.order_by === 'simcard_number' &&
              searchParam.order_direction === 'desc' ? (
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
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/simcard/$simcardId/edit"
                  params={{ simcardId: String(simcard.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(simcard)}
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
    data: simcards?.items ?? [],
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
            placeholder="Cari berdasarkan nomor sim..."
            value={filter.simcard_number}
            onChange={(e) => setFilter({ simcard_number: e.target.value })}
          />
          <Button onClick={() => handleFilterChange({ ...filter })}>
            Terapkan
          </Button>
        </div>
        <Button asChild>
          <Link to="/dashboard/simcard/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Simcard
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={simcards.paginationData.currentPage}
          totalPages={simcards.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
