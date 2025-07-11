export function replaceEmptyStringsWithUndefined<T extends Record<string, any>>(
  obj: T,
): T {
  if (!obj) {
    return obj
  }

  for (const key of Object.keys(obj)) {
    const typedKey = key as keyof T
    const value = obj[typedKey]

    if (typeof value === 'string' && value === '') {
      // Jika ya, ganti dengan undefined
      obj[typedKey] = undefined as any
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      obj[typedKey] = replaceEmptyStringsWithUndefined(value)
    }
  }

  return obj
}
