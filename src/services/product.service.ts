import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'

export const ProductFilterSchema = z.object({
  name: z.string().optional(),
})

export type ProductFilter = z.infer<typeof ProductFilterSchema>

export const GetProductsParamsSchema =
  BaseQueryParamsSchema.merge(ProductFilterSchema)

export type GetProductsParams = z.infer<typeof GetProductsParamsSchema>

export interface Product {
  id: number
  name: string
}

export interface CreateProductPayload {
  name: string
}

export interface UpdateProductPayload {
  name: string
}

export const productColumnHelper = createColumnHelper<Product>()

export const getAllProducts: GetAllServiceFn<Product, ProductFilter> = async (
  params,
) => {
  const url = generateApiUrl('/product', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  return response.json()
}

export const getProductById = async (id: number): Promise<Product> => {
  const url = generateApiUrl(`/product/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  return response.json()
}

export const createNewProduct: CreateServiceFn<
  CreateProductPayload,
  Product
> = async (payload) => {
  const url = generateApiUrl('/product')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create product')
  }

  return response.json()
}

export const updateProduct: UpdateServiceFn<
  UpdateProductPayload,
  Product
> = async (id, payload) => {
  const url = generateApiUrl(`/product/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update product')
  }

  return response.json()
}

export const deleteProduct = async (id: number) => {
  const url = generateApiUrl(`/product/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update product')
  }
}
