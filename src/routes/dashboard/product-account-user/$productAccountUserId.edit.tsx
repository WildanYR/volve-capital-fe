import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  ProductAccountUserForm,
  type productAccountUserSchema,
} from '@/components/form/ProductAccountUserForm'
import {
  getProductAccountUserById,
  updateProductAccountUser,
} from '@/services/productAccountUser.service'

export const Route = createFileRoute(
  '/dashboard/product-account-user/$productAccountUserId/edit',
)({
  component: EditProductAccountUserComponent,
})

function EditProductAccountUserComponent() {
  const { productAccountUserId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: productAccountUser } = useSuspenseQuery({
    queryKey: ['productAccountUsers', productAccountUserId],
    queryFn: () => getProductAccountUserById(+productAccountUserId),
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof productAccountUserSchema>) =>
      updateProductAccountUser(+productAccountUserId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAccountUsers'] })
      navigate({ to: '/dashboard/product-account-user' })
      toast.success('Data productAccountUser berhasil diperbarui.')
    },
    onError: (error) => {
      toast.error(`Terjadi kesalahan: ${error.message}`)
    },
  })

  if (!productAccountUser) {
    return <div>Akun User tidak ditemukan.</div>
  }

  const handleSubmit = (values: z.infer<typeof productAccountUserSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Edit Akun User: {productAccountUser.name}
      </h1>
      <ProductAccountUserForm
        onSubmit={handleSubmit}
        initialData={productAccountUser}
        isPending={mutation.isPending}
      />
    </div>
  )
}
