import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductVariantForm } from '@/components/form/ProductVariantForm'
import {
  getProductVariantById,
  updateProductVariant,
  type UpdateProductVariantPayload,
} from '@/services/productVariant.service'

export const Route = createFileRoute(
  '/dashboard/product-variant/$productVariantId/edit',
)({
  component: EditProductVariantComponent,
})

function EditProductVariantComponent() {
  const { productVariantId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: productVariant } = useSuspenseQuery({
    queryKey: ['productvariants', productVariantId],
    queryFn: () => getProductVariantById(+productVariantId),
  })

  const mutation = useMutation({
    mutationFn: (values: UpdateProductVariantPayload) =>
      updateProductVariant(+productVariantId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productvariants'] })
      navigate({ to: '/dashboard/product-variant' })
      toast.success('Data varian produk berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!productVariant) {
    return <div>varian produk tidak ditemukan.</div>
  }

  const handleSubmit = (values: UpdateProductVariantPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit Varian Produk: {productVariant.name}
      </h1>
      <ProductVariantForm
        onSubmit={handleSubmit}
        initialData={productVariant}
        isPending={mutation.isPending}
      />
    </div>
  )
}
