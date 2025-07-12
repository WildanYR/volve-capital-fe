import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Edit, Trash, PlusCircle } from 'lucide-react'
import { TableData } from '@/components/TableData'
import { Suspense, useMemo, useState } from 'react'
import { TableLoading } from '@/components/TableLoading'
import { useGlobalAlertDialog } from '@/provider/alert-dialog.provider'
import {
  deleteEwalletTopup,
  ewalletTopupColumnHelper,
  getAllEwalletTopups,
  GetEwalletTopupsParamsSchema,
  type EwalletTopup,
  type EwalletTopupFilter,
} from '@/services/ewalletTopup.service'
import { Pagination } from '@/components/Pagination'
import { createSearchHandlers } from '@/lib/createSearchHandler'
import { EwalletSelect } from '@/components/select/EwalletSelect'
import type { Ewallet } from '@/services/ewallet.service'

export const Route = createFileRoute('/dashboard/ewallet-topup/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <EwalletTopupTableComponent />
    </Suspense>
  ),
  validateSearch: GetEwalletTopupsParamsSchema,
})

function EwalletTopupTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<EwalletTopupFilter>({
    ewallet_id: searchParam.ewallet_id ?? '',
  })

  const [isEwalletFilterOpen, setIsEwalletFilterOpen] = useState(false)
  const [ewalletFilterSelected, setEwalletFilterSelected] = useState<Ewallet>()

  const { handleFilterChange, handlePaginationChange } =
    createSearchHandlers<EwalletTopupFilter>(navigate)

  const { data: ewalletTopups } = useSuspenseQuery({
    queryKey: ['ewallettopups', searchParam],
    queryFn: () => getAllEwalletTopups(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEwalletTopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallettopups'] })
      toast.success('E-wallet Topup berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus E-wallet Topup: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (ewalletTopup: EwalletTopup) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus E-wallet Topup?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus ewallettopup
          <span className="font-bold">
            {' '}
            #{ewalletTopup.id} {ewalletTopup.ewallet.ewallet_type.name} (
            {ewalletTopup.ewallet.simcard.simcard_number}){' '}
          </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(ewalletTopup.id),
    })
  }

  const clearFilter = () => {
    const filterClear: EwalletTopupFilter = { ewallet_id: '' }
    handleFilterChange(filterClear)
    setFilter(filterClear)
    setEwalletFilterSelected(undefined)
  }

  const handleEwalletFilterSelected = (ewallet: Ewallet) => {
    setEwalletFilterSelected(ewallet)
    setFilter({ ...filter, ewallet_id: ewallet.id.toString() })
  }

  const columns = useMemo(
    () => [
      ewalletTopupColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      ewalletTopupColumnHelper.accessor(
        (row) => row.ewallet.ewallet_type.name,
        {
          id: 'ewallet',
          header: 'E-Wallet',
          cell: (info) => info.getValue(),
        },
      ),
      ewalletTopupColumnHelper.accessor(
        (row) => row.ewallet.simcard.simcard_number,
        {
          id: 'simcard',
          header: 'Simcard',
          cell: (info) => info.getValue(),
        },
      ),
      ewalletTopupColumnHelper.accessor('amount', {
        header: 'Jumlah',
        cell: (info) => {
          const value = info.getValue()
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value)
        },
      }),
      ewalletTopupColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const ewallettopup = row.original
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/ewallet-topup/$ewalletTopupId/edit"
                  params={{ ewalletTopupId: String(ewallettopup.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(ewallettopup)}
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
    data: ewalletTopups?.items ?? [],
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
          <div>
            <p className="text-xs font-bold">Filter E-Wallet</p>
            <EwalletSelect
              isOpen={isEwalletFilterOpen}
              onOpenChange={setIsEwalletFilterOpen}
              selectedItem={ewalletFilterSelected}
              onSelect={handleEwalletFilterSelected}
            />
          </div>
          <Button onClick={() => handleFilterChange({ ...filter })}>
            Terapkan
          </Button>
          <Button onClick={() => clearFilter()}>Clear</Button>
        </div>
        <Button asChild>
          <Link to="/dashboard/ewallet-topup/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah E-wallet Topup
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={ewalletTopups.paginationData.currentPage}
          totalPages={ewalletTopups.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
