import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' // Pastikan path ini benar

// --- Props Interface ---
interface SelectOption {
  /**
   * The unique value for the select item. This will be passed to onChange.
   */
  value: string
  /**
   * The display text for the select item.
   */
  label: string
  /**
   * Whether the item is disabled.
   */
  disabled?: boolean
}

interface SelectFormProps {
  /**
   * The current selected value. Controlled by the parent component.
   */
  value: string | undefined
  /**
   * Callback function triggered when a new item is selected.
   * Receives the new selected value.
   */
  onChange: (value: string) => void
  /**
   * The placeholder text displayed when no item is selected.
   * @default "Select an option"
   */
  placeholder?: string
  /**
   * An array of options to display in the select dropdown.
   */
  options: SelectOption[]
  /**
   * The label for the group of options (e.g., "Fruits").
   */
  groupLabel?: string
  /**
   * Additional class name for the SelectTrigger component.
   */
  className?: string
}

export function SelectForm({
  value,
  onChange,
  placeholder = 'Select an option',
  options,
  groupLabel,
  className,
}: SelectFormProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}{' '}
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
