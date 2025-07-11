import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'
import type { Product } from './product.service'

export const ProductVariantFilterSchema = z.object({
  name: z.string().optional(),
  product_id: z.string().optional(),
})

export type ProductVariantFilter = z.infer<typeof ProductVariantFilterSchema>

export const GetProductVariantsParamsSchema = BaseQueryParamsSchema.merge(
  ProductVariantFilterSchema,
)

export type GetProductVariantsParams = z.infer<
  typeof GetProductVariantsParamsSchema
>

export interface ProductVariant {
  id: number
  name: string
  duration_hour: number
  interval_hour: number
  cooldown: number
  max_user: number
  template: string
  product_id: number
  product: Product
}

export interface CreateProductVariantPayload {
  name: string
  duration_hour: number
  interval_hour: number
  cooldown: number
  max_user: number
  template: string
  product_id: number
}

export interface UpdateProductVariantPayload {
  name?: string
  duration_hour?: number
  interval_hour?: number
  cooldown?: number
  max_user?: number
  template?: string
  product_id?: number
}

export const productVariantColumnHelper = createColumnHelper<ProductVariant>()

export const getAllProductVariants: GetAllServiceFn<
  ProductVariant,
  ProductVariantFilter
> = async (params) => {
  const url = generateApiUrl('/product-variant', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch product variant')
  }
  return response.json()
}

export const getProductVariantById = async (
  id: number,
): Promise<ProductVariant> => {
  const url = generateApiUrl(`/product-variant/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch product variant')
  }
  return response.json()
}

export const createNewProductVariant: CreateServiceFn<
  CreateProductVariantPayload,
  ProductVariant
> = async (payload) => {
  const url = generateApiUrl('/product-variant')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create product variant')
  }

  return response.json()
}

export const updateProductVariant: UpdateServiceFn<
  UpdateProductVariantPayload,
  ProductVariant
> = async (id, payload) => {
  const url = generateApiUrl(`/product-variant/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update product variant')
  }

  return response.json()
}

export const deleteProductVariant = async (id: number) => {
  const url = generateApiUrl(`/product-variant/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update product variant')
  }
}
