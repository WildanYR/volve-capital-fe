import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Platform } from '@/services/platform.service'

export const platformSchema = z.object({
  name: z.string().nonempty(),
})

type PlatformFormProps = {
  onSubmit: (values: z.infer<typeof platformSchema>) => void
  initialData?: Platform
  isPending: boolean
}

export function PlatformForm({
  onSubmit,
  initialData,
  isPending,
}: PlatformFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
    validators: {
      onSubmit: platformSchema,
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
            <Label htmlFor={field.name}>Nama Platform</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: Shopee, Tokopedia"
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
