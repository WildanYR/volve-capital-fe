import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Ewallet } from '@/services/ewallet.service'
import { DeviceSelect } from '../select/DeviceSelect'
import { useState } from 'react'
import type { Device } from '@/services/device.service'
import type { Simcard } from '@/services/simcard.service'
import type { EwalletType } from '@/services/ewalletType.service'
import { SimcardSelect } from '../select/SimcardSelect'
import { EwalletTypeSelect } from '../select/EwalletTypeSelect'
import { DatePicker } from '../DatePicker'
import { SelectForm } from '../SelectForm'

export const ewalletFormSchema = z.object({
  status: z.string(),
  registration_date: z.date(),
  simcard_id: z.string().nonempty(),
  ewallet_type_id: z.string().nonempty(),
  device_id: z.string().nonempty(),
})

export type ewalletFormSubmit = {
  status?: string
  registration_date: Date
  simcard_id: number
  ewallet_type_id: number
  device_id: number
}

type EwalletFormProps = {
  onSubmit: (values: ewalletFormSubmit) => void
  initialData?: Ewallet
  isPending: boolean
}

export function EwalletForm({
  onSubmit,
  initialData,
  isPending,
}: EwalletFormProps) {
  const [isSimcardSelectOpen, setIsSimcardSelectOpen] = useState(false)
  const [isEwalletTypeSelectOpen, setIsEwalletTypeSelectOpen] = useState(false)
  const [isDeviceSelectOpen, setIsDeviceSelectOpen] = useState(false)
  const [simcardSelected, setSimcardSelected] = useState<
    Simcard | null | undefined
  >(initialData?.simcard)
  const [ewalletTypeSelected, setEwalletTypeSelected] = useState<
    EwalletType | null | undefined
  >(initialData?.ewallet_type)
  const [deviceSelected, setDeviceSelected] = useState<
    Device | null | undefined
  >(initialData?.device)

  const statusOptions = [
    { label: 'Akfif', value: 'AKTIF' },
    { label: 'Hangus', value: 'HANGUS' },
  ]

  const form = useForm({
    defaultValues: {
      status: initialData?.status ?? '',
      registration_date: initialData?.registration_date ?? new Date(),
      simcard_id: initialData?.simcard_id.toString() ?? '',
      ewallet_type_id: initialData?.ewallet_type_id.toString() ?? '',
      device_id: initialData?.device_id.toString() ?? '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        simcard_id: parseInt(value.simcard_id),
        ewallet_type_id: parseInt(value.ewallet_type_id),
        device_id: parseInt(value.device_id),
      })
    },
    validators: {
      onSubmit: ewalletFormSchema,
    },
  })

  const handleSimcardSelected = (simcard: Simcard) => {
    setSimcardSelected(simcard)
    form.setFieldValue('simcard_id', simcard.id.toString())
  }

  const handleEwalletTypeSelected = (ewalletType: EwalletType) => {
    setEwalletTypeSelected(ewalletType)
    form.setFieldValue('ewallet_type_id', ewalletType.id.toString())
  }

  const handleDeviceSelected = (device: Device) => {
    setDeviceSelected(device)
    form.setFieldValue('device_id', device.id.toString())
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
        name="registration_date"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Tanggal Pendaftaran</Label>
            <DatePicker
              id={field.name}
              value={field.state.value}
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

      <form.Field
        name="simcard_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Simcard</Label>
            <SimcardSelect
              isOpen={isSimcardSelectOpen}
              onOpenChange={setIsSimcardSelectOpen}
              selectedItem={simcardSelected}
              onSelect={handleSimcardSelected}
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
        name="ewallet_type_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Jenis E-wallet</Label>
            <EwalletTypeSelect
              isOpen={isEwalletTypeSelectOpen}
              onOpenChange={setIsEwalletTypeSelectOpen}
              selectedItem={ewalletTypeSelected}
              onSelect={handleEwalletTypeSelected}
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
        name="device_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Device Mendaftar</Label>
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

      <form.Field
        name="status"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Status E-Wallet</Label>
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
