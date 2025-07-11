import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { ProductAccountUser } from '@/services/productAccountUser.service'
import { SelectForm } from '../SelectForm'

export const productAccountUserSchema = z.object({
  name: z.string(),
  status: z.string(),
})

type ProductAccountUserFormProps = {
  onSubmit: (values: z.infer<typeof productAccountUserSchema>) => void
  initialData?: ProductAccountUser
  isPending: boolean
}

export function ProductAccountUserForm({
  onSubmit,
  initialData,
  isPending,
}: ProductAccountUserFormProps) {
  const statusOptions = [
    { label: 'Akfif', value: 'AKTIF' },
    { label: 'Langganan Habis', value: 'EXPIRED' },
  ]

  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      status: initialData?.status || '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
    validators: {
      onSubmit: productAccountUserSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-8 max-w-2xl"
    >
      <form.Field
        name="name"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nama User Akun</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="masukkan nama user/ pembeli..."
            />
            {field.state.meta.isTouched &&
            field.state.meta.errors.length > 0 ? (
              <p className="text-sm font-medium text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            ) : null}
          </div>
        )}
      />

      <form.Field
        name="status"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Status Akun User</Label>
            <SelectForm
              value={field.state.value}
              options={statusOptions}
              onChange={(value) => {
                if (value) field.handleChange(value)
              }}
              className="w-full"
            />
            {field.state.meta.isTouched &&
            field.state.meta.errors.length > 0 ? (
              <p className="text-sm font-medium text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            ) : null}
          </div>
        )}
      />

      <Button type="submit" disabled={isPending || form.state.isSubmitting}>
        {(isPending || form.state.isSubmitting) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isPending || form.state.isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </form>
  )
}
