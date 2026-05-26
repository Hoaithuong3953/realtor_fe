import { Search } from "lucide-react"
import { Input } from "@/components/atoms"

export interface SearchFilterProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
}

export const SearchFilter = ({ value, onChange, placeholder, className }: SearchFilterProps) => {
  return (
    <Input 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      prefix={<Search className="w-4 h-4 text-muted-foreground" />}
      containerClassName={`flex-1 w-full ${className || ""}`}
    />
  )
}
