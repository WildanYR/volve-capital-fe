import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { z } from 'zod'
import type { Device } from './device.service'
import { createColumnHelper } from '@tanstack/react-table'

export const EmailFilterSchema = z.object({
  email: z.string().optional(),
})

export type EmailFilter = z.infer<typeof EmailFilterSchema>

export const GetEmailsParamsSchema =
  BaseQueryParamsSchema.merge(EmailFilterSchema)

export type GetEmailsParams = z.infer<typeof GetEmailsParamsSchema>

export interface Email {
  id: number
  email: string
  password: string
  register_device_id?: number
  device?: Device
}

export interface CreateEmailPayload {
  email: string
  password?: string
  register_device_id?: number
}

export interface UpdateEmailPayload {
  email?: string
  password?: string
  register_device_id?: number
}

export const emailColumnHelper = createColumnHelper<Email>()

export const getAllEmails: GetAllServiceFn<Email, EmailFilter> = async (
  params,
) => {
  const url = generateApiUrl('/email', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch emails')
  }
  return response.json()
}

export const getEmailById = async (id: number): Promise<Email> => {
  const url = generateApiUrl(`/email/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch emails')
  }
  return response.json()
}

export const createNewEmail: CreateServiceFn<
  CreateEmailPayload,
  Email
> = async (payload) => {
  const url = generateApiUrl('/email')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create email')
  }

  return response.json()
}

export const updateEmail: UpdateServiceFn<UpdateEmailPayload, Email> = async (
  id,
  payload,
) => {
  const url = generateApiUrl(`/email/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update email')
  }

  return response.json()
}

export const deleteEmail = async (id: number) => {
  const url = generateApiUrl(`/email/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update email')
  }
}
