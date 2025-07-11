import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { z } from 'zod'
import type { Device } from './device.service'
import type { Simcard } from './simcard.service'
import type { EwalletType } from './ewalletType.service'
import { createColumnHelper } from '@tanstack/react-table'

export const EwalletFilterSchema = z.object({
  ewallet_type_id: z.string().optional(),
  simcard_id: z.string().optional(),
  device_id: z.string().optional(),
})

export type EwalletFilter = z.infer<typeof EwalletFilterSchema>

export const GetEwalletsParamsSchema =
  BaseQueryParamsSchema.merge(EwalletFilterSchema)

export type GetEwalletsParams = z.infer<typeof GetEwalletsParamsSchema>

export interface Ewallet {
  id: number
  status?: string
  registration_date: Date
  simcard_id: number
  ewallet_type_id: number
  device_id: number
  simcard: Simcard
  ewallet_type: EwalletType
  device: Device
}

export interface CreateEwalletPayload {
  registration_date: Date
  simcard_id: number
  ewallet_type_id: number
  device_id: number
}

export interface UpdateEwalletPayload {
  registration_date?: Date
  simcard_id?: number
  ewallet_type_id?: number
  device_id?: number
}

export const ewalletColumnHelper = createColumnHelper<Ewallet>()

const convertEwalletDate = (ewallet: Ewallet): Ewallet => ({
  ...ewallet,
  registration_date: new Date(ewallet.registration_date),
})
const convertManyEwalletDate = (ewallets: Ewallet[]): Ewallet[] => {
  return ewallets.map((ewallet) => convertEwalletDate(ewallet))
}

export const getAllEwallets: GetAllServiceFn<Ewallet, EwalletFilter> = async (
  params,
) => {
  const url = generateApiUrl('/ewallet', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch ewallets')
  }
  const data = await response.json()

  return {
    paginationData: data.paginationData,
    orderData: data.orderData,
    items: convertManyEwalletDate(data.items),
  }
}

export const getEwalletById = async (id: number): Promise<Ewallet> => {
  const url = generateApiUrl(`/ewallet/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch ewallets')
  }
  const data = await response.json()
  return convertEwalletDate(data)
}

export const createNewEwallet: CreateServiceFn<
  CreateEwalletPayload,
  Ewallet
> = async (payload) => {
  const url = generateApiUrl('/ewallet')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create ewallet')
  }

  const data = await response.json()
  return convertEwalletDate(data)
}

export const updateEwallet: UpdateServiceFn<
  UpdateEwalletPayload,
  Ewallet
> = async (id, payload) => {
  const url = generateApiUrl(`/ewallet/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update ewallet')
  }

  const data = await response.json()
  return convertEwalletDate(data)
}

export const deleteEwallet = async (id: number) => {
  const url = generateApiUrl(`/ewallet/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update ewallet')
  }
}
