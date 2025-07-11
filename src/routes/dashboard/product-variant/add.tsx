import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductVariantForm } from '@/components/form/ProductVariantForm'
import {
  createNewProductVariant,
  type CreateProductVariantPayload,
} from '@/services/productVariant.service'

export const Route = createFileRoute('/dashboard/product-variant/add')({
  component: AddProductVariantComponent,
})

function AddProductVariantComponent() {
  const navigate = useNavigate({ from: '/dashboard/product-variant/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewProductVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productvariants'] })
      navigate({ to: '/dashboard/product-variant' })
      toast.success('Varian produk baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: CreateProductVariantPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Varian Produk Baru</h1>
      <ProductVariantForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
