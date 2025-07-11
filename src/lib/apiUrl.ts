import type { BaseQueryParams } from '@/types/getAllService.type'

const apiUrl: string = import.meta.env.VITE_API_URL

export function generateApiUrl<T extends Record<string, any>>(
  endpointUrl: string,
  params?: BaseQueryParams & T,
): string {
  const url = new URL(`${apiUrl}${endpointUrl}`)
  const searchParams = new URLSearchParams()

  if (params) {
    for (const key of Object.keys(params)) {
      const value = params[key as keyof T]

      if (Array.isArray(value)) {
        ;(value as Array<string | number | boolean | null | undefined>).forEach(
          (item) => {
            if (item !== null && item !== undefined && String(item) !== '') {
              searchParams.append(key, String(item))
            }
          },
        )
      } else if (
        value !== null &&
        value !== undefined &&
        String(value) !== ''
      ) {
        searchParams.append(key, String(value))
      }
    }
  }

  url.search = searchParams.toString()

  return url.toString()
}
