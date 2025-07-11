import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { EwalletType } from '@/services/ewalletType.service'

export const ewalletTypeSchema = z.object({
  name: z.string().nonempty(),
})

type EwalletTypeFormProps = {
  onSubmit: (values: z.infer<typeof ewalletTypeSchema>) => void
  initialData?: EwalletType
  isPending: boolean
}

export function EwalletTypeForm({
  onSubmit,
  initialData,
  isPending,
}: EwalletTypeFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
    validators: {
      onSubmit: ewalletTypeSchema,
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
      {/* Field untuk 'name' */}
      <form.Field
        name="name"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nama E-Wallet</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: Gopay"
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
