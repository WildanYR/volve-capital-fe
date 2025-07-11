import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Email } from '@/services/email.service'
import { DeviceSelect } from '../select/DeviceSelect'
import { useState } from 'react'
import type { Device } from '@/services/device.service'

export const emailFormSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
  register_device_id: z.string(),
})

export type emailFormSubmit = {
  email: string
  password: string
  register_device_id?: number
}

type EmailFormProps = {
  onSubmit: (values: emailFormSubmit) => void
  initialData?: Email
  isPending: boolean
}

export function EmailForm({
  onSubmit,
  initialData,
  isPending,
}: EmailFormProps) {
  const [isDeviceSelectOpen, setIsDeviceSelectOpen] = useState(false)
  const [deviceSelected, setDeviceSelected] = useState<
    Device | null | undefined
  >(initialData?.device)

  const form = useForm({
    defaultValues: {
      email: initialData?.email || '',
      password: initialData?.password || '',
      register_device_id: initialData?.register_device_id?.toString() || '',
    },
    onSubmit: async ({ value }) => {
      const register_device_id = value.register_device_id
        ? parseInt(value.register_device_id)
        : undefined
      onSubmit({ ...value, register_device_id })
    },
    validators: {
      onSubmit: emailFormSchema,
    },
  })

  const handleDeviceSelected = (device: Device) => {
    setDeviceSelected(device)
    form.setFieldValue('register_device_id', device.id.toString())
  }

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
        name="email"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: user@volvecapital.com"
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
        name="password"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Password dari Email"
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
        name="register_device_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Device</Label>
            <DeviceSelect
              isOpen={isDeviceSelectOpen}
              onOpenChange={setIsDeviceSelectOpen}
              selectedItem={deviceSelected}
              onSelect={handleDeviceSelected}
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
