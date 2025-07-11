import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  EwalletTypeForm,
  type ewalletTypeSchema,
} from '@/components/form/EwalletTypeForm'
import {
  getEwalletTypeById,
  updateEwalletType,
} from '@/services/ewalletType.service'

export const Route = createFileRoute(
  '/dashboard/ewallet-type/$ewalletTypeId/edit',
)({
  component: EditEwalletTypeComponent,
})

function EditEwalletTypeComponent() {
  const { ewalletTypeId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: ewalletType } = useSuspenseQuery({
    queryKey: ['ewallettypes', ewalletTypeId],
    queryFn: () => getEwalletTypeById(+ewalletTypeId),
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof ewalletTypeSchema>) =>
      updateEwalletType(+ewalletTypeId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallettypes'] })
      navigate({ to: '/dashboard/ewallet-type' })
      toast.success('Data ewalletType berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!ewalletType) {
    return <div>E-wallet tidak ditemukan.</div>
  }

  const handleSubmit = (values: z.infer<typeof ewalletTypeSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit E-wallet: {ewalletType.name}
      </h1>
      <EwalletTypeForm
        onSubmit={handleSubmit}
        initialData={ewalletType}
        isPending={mutation.isPending}
      />
    </div>
  )
}
