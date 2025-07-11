import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { EwalletTopupForm } from '@/components/form/EwalletTopupForm'
import {
  getEwalletTopupById,
  updateEwalletTopup,
  type UpdateEwalletTopupPayload,
} from '@/services/ewalletTopup.service'

export const Route = createFileRoute(
  '/dashboard/ewallet-topup/$ewalletTopupId/edit',
)({
  component: EditEwalletTopupComponent,
})

function EditEwalletTopupComponent() {
  const { ewalletTopupId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: ewalletTopup } = useSuspenseQuery({
    queryKey: ['ewallettopups', ewalletTopupId],
    queryFn: () => getEwalletTopupById(+ewalletTopupId),
  })

  const mutation = useMutation({
    mutationFn: (values: UpdateEwalletTopupPayload) =>
      updateEwalletTopup(+ewalletTopupId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallettopups'] })
      navigate({ to: '/dashboard/ewallet-topup' })
      toast.success('Data E-wallet Topup berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!ewalletTopup) {
    return <div>E-wallet Topup tidak ditemukan.</div>
  }

  const handleSubmit = (values: UpdateEwalletTopupPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit E-wallet Topup: #{ewalletTopup.id}{' '}
        {ewalletTopup.ewallet.ewallet_type.name} (
        {ewalletTopup.ewallet.simcard.simcard_number})
      </h1>
      <EwalletTopupForm
        onSubmit={handleSubmit}
        initialData={ewalletTopup}
        isPending={mutation.isPending}
      />
    </div>
  )
}
