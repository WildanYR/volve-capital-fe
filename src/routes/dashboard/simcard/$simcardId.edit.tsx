import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { SimcardForm, type simcardSchema } from '@/components/form/SimcardForm'
import { getSimcardById, updateSimcard } from '@/services/simcard.service'

export const Route = createFileRoute('/dashboard/simcard/$simcardId/edit')({
  component: EditSimcardComponent,
})

function EditSimcardComponent() {
  const { simcardId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: simcard } = useSuspenseQuery({
    queryKey: ['simcards', simcardId],
    queryFn: () => getSimcardById(+simcardId),
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof simcardSchema>) =>
      updateSimcard(+simcardId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simcards'] })
      navigate({ to: '/dashboard/simcard' })
      toast.success('Data simcard berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!simcard) {
    return <div>Simcard tidak ditemukan.</div>
  }

  const handleSubmit = (values: z.infer<typeof simcardSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit Simcard: {simcard.simcard_number}
      </h1>
      <SimcardForm
        onSubmit={handleSubmit}
        initialData={simcard}
        isPending={mutation.isPending}
      />
    </div>
  )
}
