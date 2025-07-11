import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { PlatformProduct } from '@/services/platformProduct.service'
import { PlatformSelect } from '../select/PlatformSelect'
import { useState } from 'react'
import type { Platform } from '@/services/platform.service'
import { ProductVariantSelect } from '../select/ProductVariantSelect'
import type { ProductVariant } from '@/services/productVariant.service'

export const platformProductSchema = z.object({
  platform_product_id: z.string().nonempty(),
  product_name: z.string().nonempty(),
  platform_id: z.string().nonempty(),
  product_variant_id: z.string().nonempty(),
})

export type platformProductFormSubmit = {
  platform_product_id: string
  product_name: string
  platform_id: number
  product_variant_id: number
}

type PlatformProductFormProps = {
  onSubmit: (values: platformProductFormSubmit) => void
  initialData?: PlatformProduct
  isPending: boolean
}

export function PlatformProductForm({
  onSubmit,
  initialData,
  isPending,
}: PlatformProductFormProps) {
  const [isPlatformSelectOpen, setIsPlatformSelectOpen] = useState(false)
  const [isProductVariantSelectOpen, setIsProductVariantSelectOpen] =
    useState(false)
  const [platformSelected, setPlatformSelected] = useState<
    Platform | null | undefined
  >(initialData?.platform)
  const [productVariantSelected, setProductVariantSelected] = useState<
    ProductVariant | null | undefined
  >(initialData?.product_variant)

  const handlePlatformSelected = (platform: Platform) => {
    setPlatformSelected(platform)
    form.setFieldValue('platform_id', platform.id.toString())
  }

  const handleProductVariantSelected = (productVariant: ProductVariant) => {
    setProductVariantSelected(productVariant)
    form.setFieldValue('product_variant_id', productVariant.id.toString())
  }

  const form = useForm({
    defaultValues: {
      platform_product_id: initialData?.platform_product_id ?? '',
      product_name: initialData?.product_name ?? '',
      platform_id: initialData?.platform_id.toString() ?? '',
      product_variant_id: initialData?.product_variant_id.toString() ?? '',
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        platform_id: parseInt(value.platform_id),
        product_variant_id: parseInt(value.product_variant_id),
      })
    },
    validators: {
      onSubmit: platformProductSchema,
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
        name="platform_product_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Produk ID Platform</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="produk id yang ada di platform seperti shopee"
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
        name="product_name"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nama Produk Platform</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="nama produk yang ada di platform seperti shopee"
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
        name="platform_id"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Platform</Label>
            <PlatformSelect
              isOpen={isPlatformSelectOpen}
              onOpenChange={setIsPlatformSelectOpen}
              selectedItem={platformSelected}
              onSelect={handlePlatformSelected}
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
