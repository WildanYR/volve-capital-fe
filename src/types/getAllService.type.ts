import { z } from 'zod'
import { PaginationSchema } from './pagination.type'
import { OrderBySchema, type OrderByParams } from './orderby.type'

export const BaseQueryParamsSchema = PaginationSchema.merge(OrderBySchema)

export type BaseQueryParams = z.infer<typeof BaseQueryParamsSchema>

export type IPaginationData = {
  currentPage: number
  totalPage: number
  limit: number
  totalItems: number
}

export type IPaginateOrderResponse<T> = {
  items: T[]
  paginationData: IPaginationData
  orderData: OrderByParams
}

export type GetAllServiceFn<TData, TFilter> = (
  params: BaseQueryParams & { filter?: TFilter },
) => Promise<IPaginateOrderResponse<TData>>
