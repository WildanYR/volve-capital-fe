import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  EwalletTypeForm,
  ewalletTypeSchema,
} from '@/components/form/EwalletTypeForm'
import { createNewEwalletType } from '@/services/ewalletType.service'

export const Route = createFileRoute('/dashboard/ewallet-type/add')({
  component: AddEwalletTypeComponent,
})

function AddEwalletTypeComponent() {
  const navigate = useNavigate({ from: '/dashboard/ewallet-type/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewEwalletType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallettypes'] })
      navigate({ to: '/dashboard/ewallet-type' })
      toast.success('E-wallet baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: z.infer<typeof ewalletTypeSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah E-wallet Baru</h1>
      <EwalletTypeForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
