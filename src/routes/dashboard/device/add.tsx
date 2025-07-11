import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { DeviceForm, deviceSchema } from '@/components/form/DeviceForm'
import { createNewDevice } from '@/services/device.service'

export const Route = createFileRoute('/dashboard/device/add')({
  component: AddDeviceComponent,
})

function AddDeviceComponent() {
  const navigate = useNavigate({ from: '/dashboard/device/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      navigate({ to: '/dashboard/device' })
      toast.success('Device baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: z.infer<typeof deviceSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Device Baru</h1>
      <DeviceForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
