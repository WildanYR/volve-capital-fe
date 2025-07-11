import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { ProductVariantSelect } from '../select/ProductVariantSelect'
import { useState } from 'react'
import type { ProductVariant } from '@/services/productVariant.service'

export const transactionSchema = z.object({
  name: z.string().min(3, 'Nama harus memiliki minimal 3 karakter.'),
  product_variant_id: z.string().nonempty(),
  status: z.string(),
})

type TransactionCreateSubmit = {
  name: string
  product_variant_id: number
  status?: string
}

type TransactionFormProps = {
  onSubmit: (values: TransactionCreateSubmit) => void
  isPending: boolean
}

export function TransactionCreateForm({
  onSubmit,
  isPending,
}: TransactionFormProps) {
  const [isProductVariantSelectOpen, setIsProductVariantSelectOpen] =
    useState(false)
  const [productVariantSelected, setProductVariantSelected] = useState<
    ProductVariant | null | undefined
  >()

  const form = useForm({
    defaultValues: {
      name: '',
      product_variant_id: '',
      status: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        product_variant_id: parseInt(value.product_variant_id),
      })
    },
    validators: {
      onSubmit: transactionSchema,
    },
  })

  const handleProductVariantSelected = (productVariant: ProductVariant) => {
    setProductVariantSelected(productVariant)
    form.setFieldValue('product_variant_id', productVariant.id.toString())
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
      {/* Field untuk 'name' */}
      <form.Field
        name="name"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nama User</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Masukkan nama user"
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
        name="product_variant_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Varian Produk</Label>
            <ProductVariantSelect
              isOpen={isProductVariantSelectOpen}
              onOpenChange={setIsProductVariantSelectOpen}
              selectedItem={productVariantSelected}
              onSelect={handleProductVariantSelected}
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
