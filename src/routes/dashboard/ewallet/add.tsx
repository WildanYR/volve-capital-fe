import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  EwalletForm,
  type ewalletFormSubmit,
} from '@/components/form/EwalletForm'
import { createNewEwallet } from '@/services/ewallet.service'

export const Route = createFileRoute('/dashboard/ewallet/add')({
  component: AddEwalletComponent,
})

function AddEwalletComponent() {
  const navigate = useNavigate({ from: '/dashboard/ewallet/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewEwallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallets'] })
      navigate({ to: '/dashboard/ewallet' })
      toast.success('Ewallet baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: ewalletFormSubmit) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah E-wallet Baru</h1>
      <EwalletForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
