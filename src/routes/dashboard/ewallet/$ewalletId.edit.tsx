import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  EwalletForm,
  type ewalletFormSubmit,
} from '@/components/form/EwalletForm'
import { getEwalletById, updateEwallet } from '@/services/ewallet.service'

export const Route = createFileRoute('/dashboard/ewallet/$ewalletId/edit')({
  component: EditEwalletComponent,
})

function EditEwalletComponent() {
  const { ewalletId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: ewallet } = useSuspenseQuery({
    queryKey: ['ewallets', ewalletId],
    queryFn: () => getEwalletById(+ewalletId),
  })

  const mutation = useMutation({
    mutationFn: (values: ewalletFormSubmit) =>
      updateEwallet(+ewalletId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ewallets'] })
      navigate({ to: '/dashboard/ewallet' })
      toast.success('Data ewallet berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!ewallet) {
    return <div>E-wallet tidak ditemukan.</div>
  }

  const handleSubmit = (values: ewalletFormSubmit) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit E-wallet: {ewallet.ewallet_type.name} (
        {ewallet.simcard.simcard_number})
      </h1>
      <EwalletForm
        onSubmit={handleSubmit}
        initialData={ewallet}
        isPending={mutation.isPending}
      />
    </div>
  )
}
