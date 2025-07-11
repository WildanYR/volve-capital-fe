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
  emailColumnHelper,
  getAllEmails,
  type Email,
  type EmailFilter,
  type GetEmailsParams,
} from '@/services/email.service'
import type { OrderByParams } from '@/types/orderby.type'
import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TableLoading } from '../TableLoading'
import { TableData } from '../TableData'
import { Pagination } from '../Pagination'
import { ScrollArea } from '../ui/scroll-area'

interface EmailSelectProps {
  isOpen: boolean
  onOpenChange: (v: boolean) => void
  selectedItem: Email | null | undefined
  onSelect: (selected: Email) => void
}

export function EmailSelect({
  isOpen,
  onOpenChange,
  selectedItem,
  onSelect,
}: EmailSelectProps) {
  const [emailParams, setEmailParams] = useState<GetEmailsParams>({
    email: '',
    order_by: undefined,
    order_direction: undefined,
    page: 1,
  })
  const [filter, setFilter] = useState<EmailFilter>({
    email: '',
  })

  const { data: emails, isLoading } = useQuery({
    queryKey: ['emails', emailParams],
    queryFn: () => getAllEmails(emailParams),
  })

  const handlePaginationChange = (newPage: number) => {
    setEmailParams({ ...emailParams, page: newPage })
  }

  const handleOrderChange = (field: string) => {
    let newOrderByState: OrderByParams | undefined

    if (emailParams.order_by === field) {
      if (emailParams.order_direction === 'asc') {
        newOrderByState = { order_by: field, order_direction: 'desc' }
      } else if (emailParams.order_direction === 'desc') {
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

    setEmailParams({ ...emailParams, ...newOrderByState })
  }

  const handleFilterChange = (filter: EmailFilter) => {
    setEmailParams({ ...emailParams, ...filter })
  }

  const handleSelectData = (email: Email) => {
    onSelect(email)
    onOpenChange(false)
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
            {emailParams.order_by === 'email' &&
            emailParams.order_direction === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : emailParams.order_by === 'email' &&
              emailParams.order_direction === 'desc' ? (
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
          return <Button onClick={() => handleSelectData(email)}>Pilih</Button>
        },
      }),
    ],
    [emailParams],
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
    <Dialog open={isOpen} onOpenChange={(status) => onOpenChange(status)}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            {selectedItem?.email ? (
              <span className="flex-1 text-left font-normal">
                {selectedItem.email}
              </span>
            ) : (
              'Pilih Email...'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-screen h-screen sm:max-w-none max-w-none rounded-none flex flex-col p-4 md:p-14">
          <DialogHeader>
            <DialogTitle>Pilih Email</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <TableLoading />
          ) : (
            <ScrollArea>
              <div className="flex gap-3">
                <Input
                  placeholder="Cari berdasarkan email..."
                  value={filter.email}
                  onChange={(e) => setFilter({ email: e.target.value })}
                />
                <Button onClick={() => handleFilterChange({ ...filter })}>
                  Terapkan
                </Button>
              </div>
              <TableData table={table} columns={columns} />
              <div className="flex items-center justify-end space-x-2 py-4">
                <Pagination
                  currentPage={emails?.paginationData.currentPage ?? 1}
                  totalPages={emails?.paginationData.totalPage ?? 1}
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
