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
  deleteEwalletType,
  ewalletTypeColumnHelper,
  getAllEwalletTypes,
  GetEwalletTypesParamsSchema,
  type EwalletType,
  type EwalletTypeFilter,
} from '@/services/ewalletType.service'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import { createSearchHandlers } from '@/lib/createSearchHandler'

export const Route = createFileRoute('/dashboard/ewallet-type/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <EwalletTypeTableComponent />
    </Suspense>
  ),
  validateSearch: GetEwalletTypesParamsSchema,
})

function EwalletTypeTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<EwalletTypeFilter>({
    name: searchParam.name ?? '',
  })
  const { handleFilterChange, handleOrderChange, handlePaginationChange } =
    createSearchHandlers<EwalletTypeFilter>(navigate)

  // Fetching data dengan TanStack Query
  const { data: ewalletTypes } = useSuspenseQuery({
    queryKey: ['ewallettypes', searchParam],
    queryFn: () => getAllEwalletTypes(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEwalletType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallettypes'] })
      toast.success('EwalletType berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus ewallettype: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (ewallettype: EwalletType) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus EwalletType?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus ewallettype
          <span className="font-bold"> {ewallettype.name} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(ewallettype.id),
    })
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
      ewalletTypeColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const ewallettype = row.original
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/ewallet-type/$ewalletTypeId/edit"
                  params={{ ewalletTypeId: String(ewallettype.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(ewallettype)}
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
    data: ewalletTypes?.items ?? [],
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
          <Link to="/dashboard/ewallet-type/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah E-wallet
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={ewalletTypes.paginationData.currentPage}
          totalPages={ewalletTypes.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
