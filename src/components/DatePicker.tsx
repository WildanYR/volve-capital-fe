import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils' // Assuming you have a utility for className concatenation

// --- Props Interface ---
interface DatePickerProps {
  /**
   * The current selected date. Controlled by the parent component.
   */
  value: Date | undefined
  /**
   * Callback function triggered when a new date is selected.
   * Receives the new date or undefined if cleared.
   */
  onChange: (date: Date | undefined) => void
  /**
   * The label text displayed above the date picker.
   * @default "Date"
   */
  label?: string
  /**
   * The placeholder text displayed when no date is selected.
   * @default "Select date"
   */
  placeholder?: string
  /**
   * The ID for the label and button. Useful for accessibility.
   * @default "date-picker"
   */
  id?: string
  /**
   * Additional class names for the main container div.
   */
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pilih Tanggal',
  id = 'date-picker',
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          className={cn('w-48 justify-between font-normal', className)}
        >
          {value ? value.toLocaleDateString() : placeholder}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(selectedDate) => {
            onChange(selectedDate)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
