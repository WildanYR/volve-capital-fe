import type { OrderByParams } from '@/types/orderby.type'
import type { useRouter } from '@tanstack/react-router'
import { replaceEmptyStringsWithUndefined } from './filterEmptyString'

export function createSearchHandlers<TFilter extends Record<string, any>>(
  // Dapatkan tipe navigate secara dinamis dari useRouter, ini adalah yang paling akurat
  // Tipe ini akan sangat kompleks, tapi itu yang diharapkan oleh TanStack Router
  navigate: ReturnType<typeof useRouter>['navigate'],
) {
  /**
   * Mengubah parameter 'page' di URL.
   * @param {number} newPage Nomor halaman baru.
   */
  const handlePaginationChange = (newPage: number) => {
    navigate({
      search: ((prev: any) => {
        const nextSearch = {
          ...prev,
          page: newPage,
        }
        return nextSearch
      }) as any,
      replace: true,
    })
  }

  /**
   * Mengubah parameter pengurutan (orderBy dan orderDirection) di URL.
   * Akan mereset halaman ke 1.
   * @param {string} field Nama kolom yang akan diurutkan.
   */
  const handleOrderChange = (field: string) => {
    navigate({
      search: ((prev: any) => {
        // Tambahkan type assertion di sini
        const currentOrderBy = (prev as OrderByParams).order_by
        const currentOrderDirection = (prev as OrderByParams).order_direction

        let newOrderByState: OrderByParams | undefined

        if (currentOrderBy === field) {
          if (currentOrderDirection === 'asc') {
            newOrderByState = { order_by: field, order_direction: 'desc' }
          } else if (currentOrderDirection === 'desc') {
            newOrderByState = {
              order_by: undefined,
              order_direction: undefined,
            }
          } else {
            newOrderByState = { order_by: field, order_direction: 'asc' }
          }
        } else {
          newOrderByState = { order_by: field, order_direction: 'asc' }
        }

        const nextSearch = {
          ...prev,
          ...newOrderByState,
          page: 1,
        }

        if (newOrderByState?.order_by === undefined) {
          delete (nextSearch as OrderByParams).order_by
        }
        if (newOrderByState?.order_direction === undefined) {
          delete (nextSearch as OrderByParams).order_direction
        }

        return nextSearch
      }) as any,
      replace: true,
    })
  }

  /**
   * Mengubah parameter filter di URL.
   * Akan mereset halaman ke 1.
   * @param {TFilter} filter Objek filter baru.
   */
  const handleFilterChange = (filter: TFilter) => {
    const processedFilter = replaceEmptyStringsWithUndefined({ ...filter })

    navigate({
      search: ((prev: any) => {
        const nextSearch = {
          ...prev,
          ...processedFilter,
          page: 1,
        }
        return nextSearch
      }) as any,
      replace: true,
    })
  }

  return {
    handlePaginationChange,
    handleOrderChange,
    handleFilterChange,
  }
}
