import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { EmailForm, type emailFormSubmit } from '@/components/form/EmailForm'
import { getEmailById, updateEmail } from '@/services/email.service'

export const Route = createFileRoute('/dashboard/email/$emailId/edit')({
  component: EditEmailComponent,
})

function EditEmailComponent() {
  const { emailId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: email } = useSuspenseQuery({
    queryKey: ['emails', emailId],
    queryFn: () => getEmailById(+emailId),
  })

  const mutation = useMutation({
    mutationFn: (values: emailFormSubmit) => updateEmail(+emailId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      navigate({ to: '/dashboard/email' })
      toast.success('Data email berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!email) {
    return <div>Email tidak ditemukan.</div>
  }

  const handleSubmit = (values: emailFormSubmit) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Email: {email.email}</h1>
      <EmailForm
        onSubmit={handleSubmit}
        initialData={email}
        isPending={mutation.isPending}
      />
    </div>
  )
}
