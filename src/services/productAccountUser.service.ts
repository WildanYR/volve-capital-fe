import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'
import type { ProductAccount } from './productAccount.service'
import type { ProductVariant } from './productVariant.service'

export const ProductAccountUserFilterSchema = z.object({
  name: z.string().optional(),
  email_id: z.string().optional(),
  product_id: z.string().optional(),
})

export type ProductAccountUserFilter = z.infer<
  typeof ProductAccountUserFilterSchema
>

export const GetProductAccountUsersParamsSchema = BaseQueryParamsSchema.merge(
  ProductAccountUserFilterSchema,
)

export type GetProductAccountUsersParams = z.infer<
  typeof GetProductAccountUsersParamsSchema
>

export interface ProductAccountUser {
  id: number
  name: string
  account_profile?: string
  status: string
  product_account_id: number
  product_account: ProductAccount
  product_variant_id: number
  product_variant: ProductVariant
}

export interface CreateProductAccountUserPayload {
  name: string
  status?: string
  product_account_id: number
}

export interface UpdateProductAccountUserPayload {
  name?: string
  status?: string
}

export const productAccountUserColumnHelper =
  createColumnHelper<ProductAccountUser>()

export const getAllProductAccountUsers: GetAllServiceFn<
  ProductAccountUser,
  ProductAccountUserFilter
> = async (params) => {
  const url = generateApiUrl('/product-account-user', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch akun')
  }
  return response.json()
}

export const getProductAccountUserById = async (
  id: number,
): Promise<ProductAccountUser> => {
  const url = generateApiUrl(`/product-account-user/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch akun')
  }
  return response.json()
}

export const createNewProductAccountUser: CreateServiceFn<
  CreateProductAccountUserPayload,
  ProductAccountUser
> = async (payload) => {
  const url = generateApiUrl('/product-account-user')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create akun')
  }

  return response.json()
}

export const updateProductAccountUser: UpdateServiceFn<
  UpdateProductAccountUserPayload,
  ProductAccountUser
> = async (id, payload) => {
  const url = generateApiUrl(`/product-account-user/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update akun')
  }

  return response.json()
}

export const deleteProductAccountUser = async (id: number) => {
  const url = generateApiUrl(`/product-account-user/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update akun')
  }
}
