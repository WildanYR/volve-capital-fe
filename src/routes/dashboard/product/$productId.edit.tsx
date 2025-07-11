import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { ProductForm, type productSchema } from '@/components/form/ProductForm'
import { getProductById, updateProduct } from '@/services/product.service'

export const Route = createFileRoute('/dashboard/product/$productId/edit')({
  component: EditProductComponent,
})

function EditProductComponent() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: product } = useSuspenseQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductById(+productId),
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof productSchema>) =>
      updateProduct(+productId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate({ to: '/dashboard/product' })
      toast.success('Data produk berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!product) {
    return <div>Produk tidak ditemukan.</div>
  }

  const handleSubmit = (values: z.infer<typeof productSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Produk: {product.name}</h1>
      <ProductForm
        onSubmit={handleSubmit}
        initialData={product}
        isPending={mutation.isPending}
      />
    </div>
  )
}
