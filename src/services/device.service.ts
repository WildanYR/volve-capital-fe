import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'

export const DeviceFilterSchema = z.object({
  name: z.string().optional(),
})

export type DeviceFilter = z.infer<typeof DeviceFilterSchema>

export const GetDevicesParamsSchema =
  BaseQueryParamsSchema.merge(DeviceFilterSchema)

export type GetDevicesParams = z.infer<typeof GetDevicesParamsSchema>

export interface Device {
  id: number
  name: string
  description: string
}

export interface CreateDevicePayload {
  name: string
  description?: string
}

export interface UpdateDevicePayload {
  name?: string
  description?: string
}

export const deviceColumnHelper = createColumnHelper<Device>()

export const getAllDevices: GetAllServiceFn<Device, DeviceFilter> = async (
  params,
) => {
  const url = generateApiUrl('/device', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch devices')
  }
  return response.json()
}

export const getDeviceById = async (id: number): Promise<Device> => {
  const url = generateApiUrl(`/device/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch devices')
  }
  return response.json()
}

export const createNewDevice: CreateServiceFn<
  CreateDevicePayload,
  Device
> = async (payload) => {
  const url = generateApiUrl('/device')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create device')
  }

  return response.json()
}

export const updateDevice: UpdateServiceFn<
  UpdateDevicePayload,
  Device
> = async (id, payload) => {
  const url = generateApiUrl(`/device/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update device')
  }

  return response.json()
}

export const deleteDevice = async (id: number) => {
  const url = generateApiUrl(`/device/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update device')
  }
}
