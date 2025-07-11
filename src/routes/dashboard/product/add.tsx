import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { ProductForm, productSchema } from '@/components/form/ProductForm'
import { createNewProduct } from '@/services/product.service'

export const Route = createFileRoute('/dashboard/product/add')({
  component: AddProductComponent,
})

function AddProductComponent() {
  const navigate = useNavigate({ from: '/dashboard/product/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate({ to: '/dashboard/product' })
      toast.success('Produk baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: z.infer<typeof productSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk Baru</h1>
      <ProductForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
