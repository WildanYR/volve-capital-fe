import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { EwalletTopup } from '@/services/ewalletTopup.service'
import { EwalletSelect } from '../select/EwalletSelect'
import { useState } from 'react'
import type { Ewallet } from '@/services/ewallet.service'

export const ewalletTopupSchema = z.object({
  amount: z.string().nonempty(),
  ewallet_id: z.string().nonempty(),
})

export type ewalletTopupFormSubmit = {
  amount: number
  ewallet_id: number
}

type EwalletTopupFormProps = {
  onSubmit: (values: ewalletTopupFormSubmit) => void
  initialData?: EwalletTopup
  isPending: boolean
}

export function EwalletTopupForm({
  onSubmit,
  initialData,
  isPending,
}: EwalletTopupFormProps) {
  const [isEwalletSelectOpen, setIsEwalletSelectOpen] = useState(false)
  const [ewalletSelected, setEwalletSelected] = useState<
    Ewallet | null | undefined
  >(initialData?.ewallet)

  const handleEwalletSelected = (ewallet: Ewallet) => {
    setEwalletSelected(ewallet)
    form.setFieldValue('ewallet_id', ewallet.id.toString())
  }

  const form = useForm({
    defaultValues: {
      amount: initialData?.amount.toString() ?? '',
      ewallet_id: initialData?.ewallet_id.toString() ?? '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        amount: parseInt(value.amount),
        ewallet_id: parseInt(value.ewallet_id),
      })
    },
    validators: {
      onSubmit: ewalletTopupSchema,
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
        name="amount"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Jumlah Top up (Rp)</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: 100000"
              type="number"
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
        name="ewallet_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>E-Wallet</Label>
            <EwalletSelect
              isOpen={isEwalletSelectOpen}
              onOpenChange={setIsEwalletSelectOpen}
              selectedItem={ewalletSelected}
              onSelect={handleEwalletSelected}
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
