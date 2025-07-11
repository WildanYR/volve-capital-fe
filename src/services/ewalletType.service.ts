import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'

export const EwalletTypeFilterSchema = z.object({
  name: z.string().optional(),
})

export type EwalletTypeFilter = z.infer<typeof EwalletTypeFilterSchema>

export const GetEwalletTypesParamsSchema = BaseQueryParamsSchema.merge(
  EwalletTypeFilterSchema,
)

export type GetEwalletTypesParams = z.infer<typeof GetEwalletTypesParamsSchema>

export interface EwalletType {
  id: number
  name: string
}

export interface CreateEwalletTypePayload {
  name: string
}

export interface UpdateEwalletTypePayload {
  name: string
}

export const ewalletTypeColumnHelper = createColumnHelper<EwalletType>()

export const getAllEwalletTypes: GetAllServiceFn<
  EwalletType,
  EwalletTypeFilter
> = async (params) => {
  const url = generateApiUrl('/ewallet-type', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch e-wallet')
  }
  return response.json()
}

export const getEwalletTypeById = async (id: number): Promise<EwalletType> => {
  const url = generateApiUrl(`/ewallet-type/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch e-wallet')
  }
  return response.json()
}

export const createNewEwalletType: CreateServiceFn<
  CreateEwalletTypePayload,
  EwalletType
> = async (payload) => {
  const url = generateApiUrl('/ewallet-type')

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

export const updateEwalletType: UpdateServiceFn<
  UpdateEwalletTypePayload,
  EwalletType
> = async (id, payload) => {
  const url = generateApiUrl(`/ewallet-type/${id}`)

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

export const deleteEwalletType = async (id: number) => {
  const url = generateApiUrl(`/ewallet-type/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update e-wallet')
  }
}
