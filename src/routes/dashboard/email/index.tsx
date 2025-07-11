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
  deleteEmail,
  emailColumnHelper,
  getAllEmails,
  GetEmailsParamsSchema,
  type Email,
  type EmailFilter,
} from '@/services/email.service'
import { Pagination } from '@/components/Pagination'
import { Input } from '@/components/ui/input'
import { createSearchHandlers } from '@/lib/createSearchHandler'

export const Route = createFileRoute('/dashboard/email/')({
  component: () => (
    <Suspense fallback={<TableLoading />}>
      <EmailTableComponent />
    </Suspense>
  ),
  validateSearch: GetEmailsParamsSchema,
})

function EmailTableComponent() {
  const queryClient = useQueryClient()
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertDialog()
  const searchParam = Route.useSearch()
  const navigate = Route.useNavigate()
  const [filter, setFilter] = useState<EmailFilter>({
    email: searchParam.email ?? '',
  })
  const { handleFilterChange, handleOrderChange, handlePaginationChange } =
    createSearchHandlers<EmailFilter>(navigate)

  const { data: emails } = useSuspenseQuery({
    queryKey: ['emails', searchParam],
    queryFn: () => getAllEmails(searchParam),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      toast.success('Email berhasil dihapus.')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus email: ${error.message}`)
    },
    onSettled: () => {
      hideAlertDialog()
    },
  })

  const handleDeleteClick = (email: Email) => {
    showAlertDialog({
      title: 'Yakin ingin menghapus Email?',
      description: (
        <>
          Aksi tidak dapat dibatalkan. Ini akan menghapus email
          <span className="font-bold"> {email.email} </span>
          secara permanen.
        </>
      ),
      confirmText: 'Hapus',
      isConfirming: deleteMutation.isPending,
      onConfirm: () => deleteMutation.mutate(email.id),
    })
  }

  const columns = useMemo(
    () => [
      emailColumnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
      }),
      emailColumnHelper.accessor('email', {
        header: () => (
          <Button variant="ghost" onClick={() => handleOrderChange('email')}>
            Email
            {searchParam.order_by === 'email' &&
            searchParam.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : searchParam.order_by === 'email' &&
              searchParam.order_direction === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      emailColumnHelper.accessor('password', {
        header: 'Password',
        cell: (info) => {
          const desc = info.getValue()
          return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc
        },
      }),
      emailColumnHelper.accessor((row) => row.device?.name, {
        header: 'Device',
        cell: (info) => {
          const deviceName = info.getValue()
          return deviceName ?? 'N/A'
        },
      }),
      emailColumnHelper.display({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const email = row.original
          return (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                <Link
                  to="/dashboard/email/$emailId/edit"
                  params={{ emailId: String(email.id) }}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(email)}
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
    data: emails?.items ?? [],
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
            value={filter.email}
            onChange={(e) => setFilter({ email: e.target.value })}
          />
          <Button onClick={() => handleFilterChange({ ...filter })}>
            Terapkan
          </Button>
        </div>
        <Button asChild>
          <Link to="/dashboard/email/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Email
          </Link>
        </Button>
      </div>
      <TableData table={table} columns={columns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination
          currentPage={emails.paginationData.currentPage}
          totalPages={emails.paginationData.totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  )
}
