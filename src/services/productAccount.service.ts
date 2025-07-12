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
import type { Email } from './email.service'
import type { Ewallet } from './ewallet.service'
import type { ProductVariant } from './productVariant.service'

export const ProductAccountFilterSchema = z.object({
  email_id: z.string().optional(),
  product_id: z.string().optional(),
})

export type ProductAccountFilter = z.infer<typeof ProductAccountFilterSchema>

export const GetProductAccountsParamsSchema = BaseQueryParamsSchema.merge(
  ProductAccountFilterSchema,
)

export type GetProductAccountsParams = z.infer<
  typeof GetProductAccountsParamsSchema
>

export interface ProductAccount {
  id: number
  account_password: string
  subscription_expiry: Date
  status: string
  email_id: number
  product_id: number
  ewallet_id: number
  product_variant_id: number
  email: Email
  ewallet: Ewallet
  product: Product
  product_variant: ProductVariant
  batch_start_date?: Date | null
  batch_end_date?: Date | null
  user_count: number
}

export interface CreateProductAccountPayload {
  account_password: string
  subscription_expiry: Date
  status: string
  email_id: number
  product_id: number
  ewallet_id: number
}

export interface UpdateProductAccountPayload {
  account_password?: string
  subscription_expiry?: Date
  status?: string
  email_id?: number
  product_id?: number
  ewallet_id?: number
}

export const productAccountColumnHelper = createColumnHelper<ProductAccount>()

const convertProductAccountDate = (
  productAccount: ProductAccount,
): ProductAccount => ({
  ...productAccount,
  subscription_expiry: new Date(productAccount.subscription_expiry),
  batch_start_date: productAccount.batch_start_date
    ? new Date(productAccount.batch_start_date)
    : null,
  batch_end_date: productAccount.batch_end_date
    ? new Date(productAccount.batch_end_date)
    : null,
})
const convertManyProductAccountDate = (
  productAccounts: ProductAccount[],
): ProductAccount[] => {
  return productAccounts.map((productAccount) =>
    convertProductAccountDate(productAccount),
  )
}

export const getAllProductAccounts: GetAllServiceFn<
  ProductAccount,
  ProductAccountFilter
> = async (params) => {
  const url = generateApiUrl('/product-account', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch akun')
  }
  const data = await response.json()

  return {
    paginationData: data.paginationData,
    orderData: data.orderData,
    items: convertManyProductAccountDate(data.items),
  }
}

export const getProductAccountById = async (
  id: number,
): Promise<ProductAccount> => {
  const url = generateApiUrl(`/product-account/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch akun')
  }
  const data = await response.json()
  return convertProductAccountDate(data)
}

export const createNewProductAccount: CreateServiceFn<
  CreateProductAccountPayload,
  ProductAccount
> = async (payload) => {
  const url = generateApiUrl('/product-account')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      subscription_expiry: payload.subscription_expiry.toISOString(),
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create akun')
  }

  const data = await response.json()
  return convertProductAccountDate(data)
}

export const updateProductAccount: UpdateServiceFn<
  UpdateProductAccountPayload,
  ProductAccount
> = async (id, payload) => {
  const url = generateApiUrl(`/product-account/${id}`)

  const subscription_expiry = payload.subscription_expiry
    ? payload.subscription_expiry.toISOString()
    : undefined

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...payload, subscription_expiry }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update akun')
  }

  const data = await response.json()
  return convertProductAccountDate(data)
}

export const deleteProductAccount = async (id: number) => {
  const url = generateApiUrl(`/product-account/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update akun')
  }
}
