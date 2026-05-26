import { ArrowUpDown } from "lucide-react"
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SortOption {
  label: string
  value: string
}

export interface SortDropdownProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SortDropdown = ({ options, value, onChange, placeholder, className }: SortDropdownProps) => {
  return (
    <UISelect value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UISelect>
  )
}
