import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'
import type { Platform } from './platform.service'
import type { ProductVariant } from './productVariant.service'

export const PlatformProductFilterSchema = z.object({
  product_name: z.string().optional(),
  platform_id: z.string().optional(),
  product_id: z.string().optional(),
})

export type PlatformProductFilter = z.infer<typeof PlatformProductFilterSchema>

export const GetPlatformProductsParamsSchema = BaseQueryParamsSchema.merge(
  PlatformProductFilterSchema,
)

export type GetPlatformProductsParams = z.infer<
  typeof GetPlatformProductsParamsSchema
>

export interface PlatformProduct {
  id: number
  platform_product_id: string
  product_name: string
  platform_id: number
  product_variant_id: number
  platform: Platform
  product_variant: ProductVariant
}

export interface CreatePlatformProductPayload {
  platform_product_id: string
  product_name: string
  platform_id: number
  product_variant_id: number
}

export interface UpdatePlatformProductPayload {
  platform_product_id: string
  product_name: string
  platform_id: number
  product_variant_id: number
}

export const platformProductColumnHelper = createColumnHelper<PlatformProduct>()

export const getAllPlatformProducts: GetAllServiceFn<
  PlatformProduct,
  PlatformProductFilter
> = async (params) => {
  const url = generateApiUrl('/platform-product', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch e-wallet')
  }
  return response.json()
}

export const getPlatformProductById = async (
  id: number,
): Promise<PlatformProduct> => {
  const url = generateApiUrl(`/platform-product/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch e-wallet')
  }
  return response.json()
}

export const createNewPlatformProduct: CreateServiceFn<
  CreatePlatformProductPayload,
  PlatformProduct
> = async (payload) => {
  const url = generateApiUrl('/platform-product')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create e-wallet')
  }

  return response.json()
}

export const updatePlatformProduct: UpdateServiceFn<
  UpdatePlatformProductPayload,
  PlatformProduct
> = async (id, payload) => {
  const url = generateApiUrl(`/platform-product/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update e-wallet')
  }

  return response.json()
}

export const deletePlatformProduct = async (id: number) => {
  const url = generateApiUrl(`/platform-product/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update e-wallet')
  }
}
