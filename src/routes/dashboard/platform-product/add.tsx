import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PlatformProductForm } from '@/components/form/PlatformProductForm'
import {
  createNewPlatformProduct,
  type CreatePlatformProductPayload,
} from '@/services/platformProduct.service'

export const Route = createFileRoute('/dashboard/platform-product/add')({
  component: AddPlatformProductComponent,
})

function AddPlatformProductComponent() {
  const navigate = useNavigate({ from: '/dashboard/platform-product/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewPlatformProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformproducts'] })
      navigate({ to: '/dashboard/platform-product' })
      toast.success('Produk Platform baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: CreatePlatformProductPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk Platform Baru</h1>
      <PlatformProductForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
