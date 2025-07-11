import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'

export const PlatformFilterSchema = z.object({
  name: z.string().optional(),
})

export type PlatformFilter = z.infer<typeof PlatformFilterSchema>

export const GetPlatformsParamsSchema =
  BaseQueryParamsSchema.merge(PlatformFilterSchema)

export type GetPlatformsParams = z.infer<typeof GetPlatformsParamsSchema>

export interface Platform {
  id: number
  name: string
}

export interface CreatePlatformPayload {
  name: string
}

export interface UpdatePlatformPayload {
  name: string
}

export const platformColumnHelper = createColumnHelper<Platform>()

export const getAllPlatforms: GetAllServiceFn<
  Platform,
  PlatformFilter
> = async (params) => {
  const url = generateApiUrl('/platform', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch platform')
  }
  return response.json()
}

export const getPlatformById = async (id: number): Promise<Platform> => {
  const url = generateApiUrl(`/platform/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch platform')
  }
  return response.json()
}

export const createNewPlatform: CreateServiceFn<
  CreatePlatformPayload,
  Platform
> = async (payload) => {
  const url = generateApiUrl('/platform')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create platform')
  }

  return response.json()
}

export const updatePlatform: UpdateServiceFn<
  UpdatePlatformPayload,
  Platform
> = async (id, payload) => {
  const url = generateApiUrl(`/platform/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update platform')
  }

  return response.json()
}

export const deletePlatform = async (id: number) => {
  const url = generateApiUrl(`/platform/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update platform')
  }
}
