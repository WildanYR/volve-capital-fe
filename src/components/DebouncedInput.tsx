import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface DebouncedInputProps {
  value?: string
  onDebouncedChange: (value?: string) => void
  delay?: number
  placeholder?: string
  className?: string
}

export function DebouncedInput({
  value,
  onDebouncedChange,
  delay = 500,
  placeholder,
  className,
}: DebouncedInputProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      onDebouncedChange(inputValue)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [inputValue, delay, onDebouncedChange])

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      className={cn(className)}
    />
  )
}
