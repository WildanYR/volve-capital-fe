import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'
import type { Ewallet } from './ewallet.service'

export const EwalletTopupFilterSchema = z.object({
  ewallet_id: z.string().optional(),
})

export type EwalletTopupFilter = z.infer<typeof EwalletTopupFilterSchema>

export const GetEwalletTopupsParamsSchema = BaseQueryParamsSchema.merge(
  EwalletTopupFilterSchema,
)

export type GetEwalletTopupsParams = z.infer<
  typeof GetEwalletTopupsParamsSchema
>

export interface EwalletTopup {
  id: number
  amount: number
  ewallet_id: number
  ewallet: Ewallet
}

export interface CreateEwalletTopupPayload {
  amount: number
  ewallet_id: number
}

export interface UpdateEwalletTopupPayload {
  amount?: number
  ewallet_id?: number
}

export const ewalletTopupColumnHelper = createColumnHelper<EwalletTopup>()

export const getAllEwalletTopups: GetAllServiceFn<
  EwalletTopup,
  EwalletTopupFilter
> = async (params) => {
  const url = generateApiUrl('/ewallet-topup', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch e-wallet')
  }
  return response.json()
}

export const getEwalletTopupById = async (
  id: number,
): Promise<EwalletTopup> => {
  const url = generateApiUrl(`/ewallet-topup/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch e-wallet')
  }
  return response.json()
}

export const createNewEwalletTopup: CreateServiceFn<
  CreateEwalletTopupPayload,
  EwalletTopup
> = async (payload) => {
  const url = generateApiUrl('/ewallet-topup')

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

export const updateEwalletTopup: UpdateServiceFn<
  UpdateEwalletTopupPayload,
  EwalletTopup
> = async (id, payload) => {
  const url = generateApiUrl(`/ewallet-topup/${id}`)

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

export const deleteEwalletTopup = async (id: number) => {
  const url = generateApiUrl(`/ewallet-topup/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update e-wallet')
  }
}
