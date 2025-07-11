import { generateApiUrl } from '@/lib/apiUrl'
import type { CreateServiceFn } from '@/types/createService.type'
import {
  BaseQueryParamsSchema,
  type GetAllServiceFn,
} from '@/types/getAllService.type'
import type { UpdateServiceFn } from '@/types/updateService.type'
import { createColumnHelper } from '@tanstack/react-table'
import { z } from 'zod'
import type { ProductVariant } from './productVariant.service'
import type { ProductAccountUser } from './productAccountUser.service'
import type { ProductAccount } from './productAccount.service'

export const TransactionFilterSchema = z.object({
  product_variant_id: z.string().optional(),
})

export type TransactionFilter = z.infer<typeof TransactionFilterSchema>

export const GetTransactionsParamsSchema = BaseQueryParamsSchema.merge(
  TransactionFilterSchema,
)

export type GetTransactionsParams = z.infer<typeof GetTransactionsParamsSchema>

export interface Transaction {
  id: number
  status: string
  product_variant_id: number
  product_account_id: number
  product_account_user_id: number
  product_variant: ProductVariant
  product_account: ProductAccount
  product_account_user: ProductAccountUser
  created_at: Date
}

export interface CreateTransactionPayload {
  name: string
  product_variant_id: number
  status?: string
}

export interface UpdateTransactionPayload {
  status?: string
  product_variant_id?: number
  product_account_id?: number
  product_account_user_id?: number
}

export const transactionColumnHelper = createColumnHelper<Transaction>()

const convertTransactionDate = (transaction: Transaction): Transaction => ({
  ...transaction,
  created_at: new Date(transaction.created_at),
})
const convertManyTransactionDate = (
  transactions: Transaction[],
): Transaction[] => {
  return transactions.map((transaction) => convertTransactionDate(transaction))
}

export const getAllTransactions: GetAllServiceFn<
  Transaction,
  TransactionFilter
> = async (params) => {
  const url = generateApiUrl('/transaction', params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch transactions')
  }
  const data = await response.json()

  return {
    paginationData: data.paginationData,
    orderData: data.orderData,
    items: convertManyTransactionDate(data.items),
  }
}

export const getTransactionById = async (id: number): Promise<Transaction> => {
  const url = generateApiUrl(`/transaction/${id}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch transactions')
  }
  const data = await response.json()
  return convertTransactionDate(data)
}

export const createNewTransaction: CreateServiceFn<
  CreateTransactionPayload,
  Transaction
> = async (payload) => {
  const url = generateApiUrl('/transaction')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create transaction')
  }

  const data = await response.json()
  return convertTransactionDate(data)
}

export const updateTransaction: UpdateServiceFn<
  UpdateTransactionPayload,
  Transaction
> = async (id, payload) => {
  const url = generateApiUrl(`/transaction/${id}`)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update transaction')
  }

  const data = await response.json()
  return convertTransactionDate(data)
}

export const deleteTransaction = async (id: number) => {
  const url = generateApiUrl(`/transaction/${id}`)

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update transaction')
  }
}
