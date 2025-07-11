import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { PlatformForm, platformSchema } from '@/components/form/PlatformForm'
import { createNewPlatform } from '@/services/platform.service'

export const Route = createFileRoute('/dashboard/platform/add')({
  component: AddPlatformComponent,
})

function AddPlatformComponent() {
  const navigate = useNavigate({ from: '/dashboard/platform/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewPlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
      navigate({ to: '/dashboard/platform' })
      toast.success('Produk baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: z.infer<typeof platformSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk Baru</h1>
      <PlatformForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
