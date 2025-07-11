import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { SimcardForm, simcardSchema } from '@/components/form/SimcardForm'
import { createNewSimcard } from '@/services/simcard.service'

export const Route = createFileRoute('/dashboard/simcard/add')({
  component: AddSimcardComponent,
})

function AddSimcardComponent() {
  const navigate = useNavigate({ from: '/dashboard/simcard/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewSimcard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simcards'] })
      navigate({ to: '/dashboard/simcard' })
      toast.success('Simcard baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: z.infer<typeof simcardSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Simcard Baru</h1>
      <SimcardForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
