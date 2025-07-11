import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'

export const SimcardFilterSchema = z.object({
  simcard_number: z.string().optional(),
})

export type SimcardFilter = z.infer<typeof SimcardFilterSchema>

export const GetSimcardsParamsSchema =
  BaseQueryParamsSchema.merge(SimcardFilterSchema)

export type GetSimcardsParams = z.infer<typeof GetSimcardsParamsSchema>

export interface Simcard {
  id: number
  simcard_number: string
  location: string
}

export interface CreateSimcardPayload {
  simcard_number: string
  location?: string
}

export interface UpdateSimcardPayload {
  simcard_number?: string
  location?: string
}

export const simcardColumnHelper = createColumnHelper<Simcard>()

export const getAllSimcards: GetAllServiceFn<Simcard, SimcardFilter> = async (
  params,
) => {
  const url = generateApiUrl('/simcard', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch simcards')
  }
  return response.json()
}

export const getSimcardById = async (id: number): Promise<Simcard> => {
  const url = generateApiUrl(`/simcard/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch simcards')
  }
  return response.json()
}

export const createNewSimcard: CreateServiceFn<
  CreateSimcardPayload,
  Simcard
> = async (payload) => {
  const url = generateApiUrl('/simcard')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create simcard')
  }

  return response.json()
}

export const updateSimcard: UpdateServiceFn<
  UpdateSimcardPayload,
  Simcard
> = async (id, payload) => {
  const url = generateApiUrl(`/simcard/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update simcard')
  }

  return response.json()
}

export const deleteSimcard = async (id: number) => {
  const url = generateApiUrl(`/simcard/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update simcard')
  }
}
