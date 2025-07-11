import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { EmailForm, type emailFormSubmit } from '@/components/form/EmailForm'
import { createNewEmail } from '@/services/email.service'

export const Route = createFileRoute('/dashboard/email/add')({
  component: AddEmailComponent,
})

function AddEmailComponent() {
  const navigate = useNavigate({ from: '/dashboard/email/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      navigate({ to: '/dashboard/email' })
      toast.success('Email baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: emailFormSubmit) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Email Baru</h1>
      <EmailForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
