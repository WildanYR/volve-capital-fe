import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProductAccountForm } from '@/components/form/ProductAccountForm'
import {
  getProductAccountById,
  updateProductAccount,
  type UpdateProductAccountPayload,
} from '@/services/productAccount.service'

export const Route = createFileRoute(
  '/dashboard/product-account/$productAccountId/edit',
)({
  component: EditProductAccountComponent,
})

function EditProductAccountComponent() {
  const { productAccountId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: productAccount } = useSuspenseQuery({
    queryKey: ['productaccounts', productAccountId],
    queryFn: () => getProductAccountById(+productAccountId),
  })

  const mutation = useMutation({
    mutationFn: (values: UpdateProductAccountPayload) =>
      updateProductAccount(+productAccountId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productaccounts'] })
      navigate({ to: '/dashboard/product-account' })
      toast.success('Data akun berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!productAccount) {
    return <div>akun tidak ditemukan.</div>
  }

  const handleSubmit = (values: UpdateProductAccountPayload) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit Akun: {productAccount.email.email} ({productAccount.product.name})
      </h1>
      <ProductAccountForm
        onSubmit={handleSubmit}
        initialData={productAccount}
        isPending={mutation.isPending}
      />
    </div>
  )
}
