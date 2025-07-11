import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { PlatformProductForm } from '@/components/form/PlatformProductForm'
import {
  getPlatformProductById,
  updatePlatformProduct,
  type UpdatePlatformProductPayload,
} from '@/services/platformProduct.service'

export const Route = createFileRoute(
  '/dashboard/platform-product/$platformProductId/edit',
)({
  component: EditPlatformProductComponent,
})

function EditPlatformProductComponent() {
  const { platformProductId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: platformProduct } = useSuspenseQuery({
    queryKey: ['platformproducts', platformProductId],
    queryFn: () => getPlatformProductById(+platformProductId),
  })

  const mutation = useMutation({
    mutationFn: (values: UpdatePlatformProductPayload) =>
      updatePlatformProduct(+platformProductId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformproducts'] })
      navigate({ to: '/dashboard/platform-product' })
      toast.success('Data produk platform berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!platformProduct) {
    return <div>produk platform tidak ditemukan.</div>
  }

  const handleSubmit = (values: UpdatePlatformProductPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit Produk Platform: {platformProduct.product_name}
      </h1>
      <PlatformProductForm
        onSubmit={handleSubmit}
        initialData={platformProduct}
        isPending={mutation.isPending}
      />
    </div>
  )
}
