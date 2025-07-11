import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { ProductVariant } from '@/services/productVariant.service'
import { useState } from 'react'
import type { Product } from '@/services/product.service'
import { ProductSelect } from '../select/ProductSelect'
import { Textarea } from '../ui/textarea'

export const ProductVariantFormSchema = z.object({
  name: z.string().nonempty(),
  duration_hour: z.string().nonempty(),
  interval_hour: z.string().nonempty(),
  cooldown: z.string().nonempty(),
  max_user: z.string().nonempty(),
  template: z.string(),
  product_id: z.string().nonempty(),
})

export type ProductVariantFormSubmit = {
  name: string
  duration_hour: number
  interval_hour: number
  cooldown: number
  max_user: number
  template: string
  product_id: number
}

type ProductVariantFormProps = {
  onSubmit: (values: ProductVariantFormSubmit) => void
  initialData?: ProductVariant
  isPending: boolean
}

export function ProductVariantForm({
  onSubmit,
  initialData,
  isPending,
}: ProductVariantFormProps) {
  const [isProductSelectOpen, setIsProductSelectOpen] = useState(false)
  const [productSelected, setProductSelected] = useState<
    Product | null | undefined
  >(initialData?.product)

  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      duration_hour: initialData?.duration_hour.toString() || '',
      interval_hour: initialData?.interval_hour.toString() || '',
      cooldown: initialData?.cooldown.toString() || '',
      max_user: initialData?.max_user.toString() || '',
      template: initialData?.template || '',
      product_id: initialData?.product_id.toString() || '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        duration_hour: parseInt(value.duration_hour),
        interval_hour: parseInt(value.interval_hour),
        cooldown: parseInt(value.cooldown),
        max_user: parseInt(value.max_user),
        product_id: parseInt(value.product_id),
      })
    },
    validators: {
      onSubmit: ProductVariantFormSchema,
    },
  })

  const handleProductSelected = (product: Product) => {
    setProductSelected(product)
    form.setFieldValue('product_id', product.id.toString())
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
        name="name"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nama varian</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: Harian, Mingguan, Bulanan"
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
        name="duration_hour"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Durasi (jam)</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: 24 (untuk harian)"
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
        name="interval_hour"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Interval (jam)</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: 48 (2 hari interval)"
              type="number"
            />
            <p className="text-xs text-gray-400">
              Interval dalam jam untuk user bisa mendapatkan akun yang sama.
              misal user pertama daftar tanggal 1 maka user kedua akan
              mendapatkan akun yang sama jika mendaftar masih dalam interval.
              set ke 0 untuk disable interval
            </p>
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
        name="cooldown"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Cooldown (Menit)</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Contoh: 5 (5 menit sebelum akun bisa dipakai ulang)"
              type="number"
            />
            <p className="text-xs text-gray-400">
              Akun tidak bisa dipakai oleh user baru selama masa cooldown dari
              user terakhir yang mendaftar
            </p>
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
        name="max_user"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Maksimal Pengguna</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Pengguna maksimal dalam 1 akun"
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
        name="template"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Template</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Template pesan untuk di copy di akun"
            />
            <div className="text-xs text-gray-400">
              <p>Template Tags:</p>
              <p>{'{email}'} : Email akun</p>
              <p>{'{pass}'} : Password akun</p>
              <p>{'{profil}'} : Profil akun</p>
              <p>{'{expired}'} : Tanggal expired akun</p>
            </div>
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
