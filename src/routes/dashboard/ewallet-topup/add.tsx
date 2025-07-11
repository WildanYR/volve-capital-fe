import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { EwalletTopupForm } from '@/components/form/EwalletTopupForm'
import {
  createNewEwalletTopup,
  type CreateEwalletTopupPayload,
} from '@/services/ewalletTopup.service'

export const Route = createFileRoute('/dashboard/ewallet-topup/add')({
  component: AddEwalletTopupComponent,
})

function AddEwalletTopupComponent() {
  const navigate = useNavigate({ from: '/dashboard/ewallet-topup/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewEwalletTopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallettopups'] })
      navigate({ to: '/dashboard/ewallet-topup' })
      toast.success('E-wallet Topup baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: CreateEwalletTopupPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah E-wallet Topup Baru</h1>
      <EwalletTopupForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
