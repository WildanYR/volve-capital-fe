import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import type { z } from 'zod'
import { DeviceForm, type deviceSchema } from '@/components/form/DeviceForm'
import { getDeviceById, updateDevice } from '@/services/device.service'

export const Route = createFileRoute('/dashboard/device/$deviceId/edit')({
  component: EditDeviceComponent,
})

function EditDeviceComponent() {
  const { deviceId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: device } = useSuspenseQuery({
    queryKey: ['devices', deviceId],
    queryFn: () => getDeviceById(+deviceId),
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof deviceSchema>) =>
      updateDevice(+deviceId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      navigate({ to: '/dashboard/device' })
      toast.success('Data device berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!device) {
    return <div>Device tidak ditemukan.</div>
  }

  const handleSubmit = (values: z.infer<typeof deviceSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Device: {device.name}</h1>
      <DeviceForm
        onSubmit={handleSubmit}
        initialData={device}
        isPending={mutation.isPending}
      />
    </div>
  )
}
