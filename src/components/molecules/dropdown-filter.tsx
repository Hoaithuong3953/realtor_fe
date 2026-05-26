import { Select, type SelectOption } from "@/components/molecules/select"

export interface DropdownFilterProps {
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export const DropdownFilter = ({ value, onChange, options, placeholder, className }: DropdownFilterProps) => {
  return (
    <Select 
      className={`flex-1 w-full ${className || ""}`}
      value={value || "all"}
      onChange={(val) => onChange(val === "all" ? "" : val)}
      placeholder={placeholder}
      options={options}
    />
  )
}
