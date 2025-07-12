import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { ProductAccount } from '@/services/productAccount.service'
import { useState } from 'react'
import { SelectForm } from '../SelectForm'
import { EwalletSelect } from '../select/EwalletSelect'
import { EmailSelect } from '../select/EmailSelect'
import type { Email } from '@/services/email.service'
import type { Ewallet } from '@/services/ewallet.service'
import { ProductSelect } from '../select/ProductSelect'
import type { Product } from '@/services/product.service'
import { DatePicker } from '../DatePicker'

export const productAccountSchema = z.object({
  account_password: z.string().nonempty(),
  subscription_expiry: z.date(),
  status: z.string().nonempty(),
  email_id: z.string().nonempty(),
  product_id: z.string().nonempty(),
  ewallet_id: z.string().nonempty(),
})

export type productAccountFormSubmit = {
  account_password: string
  subscription_expiry: Date
  status: string
  email_id: number
  product_id: number
  ewallet_id: number
}

type ProductAccountFormProps = {
  onSubmit: (values: productAccountFormSubmit) => void
  initialData?: ProductAccount
  isPending: boolean
}

export function ProductAccountForm({
  onSubmit,
  initialData,
  isPending,
}: ProductAccountFormProps) {
  const statusOptions = [
    { label: 'Kosong', value: 'KOSONG' },
    { label: 'Non-Aktif', value: 'NONAKTIF' },
  ]

  const [isEmailSelectOpen, setIsEmailSelectOpen] = useState(false)
  const [isProductSelectOpen, setIsProductSelectOpen] = useState(false)
  const [isEwalletSelectOpen, setIsEwalletSelectOpen] = useState(false)

  const [emailSelected, setEmailSelected] = useState<Email | null | undefined>(
    initialData?.email,
  )

  const [productSelected, setProductSelected] = useState<
    Product | null | undefined
  >(initialData?.product)
  const [ewalletSelected, setEwalletSelected] = useState<
    Ewallet | null | undefined
  >(initialData?.ewallet)

  const handleEmailSelected = (email: Email) => {
    setEmailSelected(email)
    form.setFieldValue('email_id', email.id.toString())
  }
  const handleProductSelected = (product: Product) => {
    setProductSelected(product)
    form.setFieldValue('product_id', product.id.toString())
  }
  const handleEwalletSelected = (ewallet: Ewallet) => {
    setEwalletSelected(ewallet)
    form.setFieldValue('ewallet_id', ewallet.id.toString())
  }

  const form = useForm({
    defaultValues: {
      account_password: initialData?.account_password ?? '',
      subscription_expiry: initialData?.subscription_expiry ?? new Date(),
      status: initialData?.status ?? '',
      email_id: initialData?.email_id.toString() ?? '',
      product_id: initialData?.product_id.toString() ?? '',
      ewallet_id: initialData?.ewallet_id.toString() ?? '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        email_id: parseInt(value.email_id),
        product_id: parseInt(value.product_id),
        ewallet_id: parseInt(value.ewallet_id),
      })
    },
    validators: {
      onSubmit: productAccountSchema,
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
        name="email_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <EmailSelect
              isOpen={isEmailSelectOpen}
              onOpenChange={setIsEmailSelectOpen}
              selectedItem={emailSelected}
              onSelect={handleEmailSelected}
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
        name="account_password"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password Akun</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Masukkan password akun..."
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
        name="subscription_expiry"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Tanggal Layanan Berakhir</Label>
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
        name="status"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Status Akun</Label>
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

      <form.Field
        name="product_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Produk</Label>
            <ProductSelect
              isOpen={isProductSelectOpen}
              onOpenChange={setIsProductSelectOpen}
              selectedItem={productSelected}
              onSelect={handleProductSelected}
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
