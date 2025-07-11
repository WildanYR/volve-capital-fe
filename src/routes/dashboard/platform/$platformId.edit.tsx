import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  PlatformForm,
  type platformSchema,
} from '@/components/form/PlatformForm'
import { getPlatformById, updatePlatform } from '@/services/platform.service'

export const Route = createFileRoute('/dashboard/platform/$platformId/edit')({
  component: EditPlatformComponent,
})

function EditPlatformComponent() {
  const { platformId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: platform } = useSuspenseQuery({
    queryKey: ['platforms', platformId],
    queryFn: () => getPlatformById(+platformId),
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof platformSchema>) =>
      updatePlatform(+platformId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] })
      navigate({ to: '/dashboard/platform' })
      toast.success('Data produk berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!platform) {
    return <div>Produk tidak ditemukan.</div>
  }

  const handleSubmit = (values: z.infer<typeof platformSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Produk: {platform.name}</h1>
      <PlatformForm
        onSubmit={handleSubmit}
        initialData={platform}
        isPending={mutation.isPending}
      />
    </div>
  )
}
