import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductAccountForm } from '@/components/form/ProductAccountForm'
import {
  createNewProductAccount,
  type CreateProductAccountPayload,
} from '@/services/productAccount.service'

export const Route = createFileRoute('/dashboard/product-account/add')({
  component: AddProductAccountComponent,
})

function AddProductAccountComponent() {
  const navigate = useNavigate({ from: '/dashboard/product-account/add' })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createNewProductAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productaccounts'] })
      navigate({ to: '/dashboard/product-account' })
      toast.success('Akun baru berhasil ditambahkan.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  const handleSubmit = (values: CreateProductAccountPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Akun Baru</h1>
      <ProductAccountForm
        onSubmit={(value) => handleSubmit(value)}
        isPending={mutation.isPending}
      />
    </div>
  )
}
