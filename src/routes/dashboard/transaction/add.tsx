import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createNewTransaction,
  type CreateTransactionPayload,
} from '@/services/transaction.service'
import { TransactionCreateForm } from '@/components/form/TransactionCreateForm'

export const Route = createFileRoute('/dashboard/transaction/add')({
  component: AddTransactionComponent,
})

function AddTransactionComponent() {
  const navigate = useNavigate({ from: '/dashboard/transaction/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['productAccountUsers'] })
      navigate({ to: '/dashboard/transaction' })
      toast.success('Akun baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: CreateTransactionPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi (Akun) Baru</h1>
      <TransactionCreateForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
