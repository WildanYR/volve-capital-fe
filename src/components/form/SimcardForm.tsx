import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Simcard } from '@/services/simcard.service'

export const simcardSchema = z.object({
  simcard_number: z.string().min(8),
  location: z.string(),
})

type SimcardFormProps = {
  onSubmit: (values: z.infer<typeof simcardSchema>) => void
  initialData?: Simcard
  isPending: boolean
}

export function SimcardForm({
  onSubmit,
  initialData,
  isPending,
}: SimcardFormProps) {
  const form = useForm({
    defaultValues: {
      simcard_number: initialData?.simcard_number || '',
      location: initialData?.location || '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
    validators: {
      onSubmit: simcardSchema,
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
        name="simcard_number"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nomor Sim</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: 081254387690"
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
        name="location"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Lokasi Penyimpanan</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Lokasi dimana simcard disimpan..."
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
