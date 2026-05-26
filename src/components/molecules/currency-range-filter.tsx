import { formatCurrencyInput, parseCurrencyInput } from "@/utils/currency-formatter"
import { type ChangeEvent } from "react"

export interface CurrencyRangeFilterProps {
  minValue: string | number
  maxValue: string | number
  onMinChange: (val: string) => void
  onMaxChange: (val: string) => void
  minPlaceholder?: string
  maxPlaceholder?: string
  className?: string
}

export const CurrencyRangeFilter = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder,
  maxPlaceholder,
  className
}: CurrencyRangeFilterProps) => {
  
  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseCurrencyInput(e.target.value)
    if (parsed !== undefined) {
      onMinChange(parsed === null ? "" : String(parsed))
    }
  }

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseCurrencyInput(e.target.value)
    if (parsed !== undefined) {
      onMaxChange(parsed === null ? "" : String(parsed))
    }
  }

  return (
    <div className={`flex items-center gap-2 bg-background border rounded-md px-3 h-10 flex-1 w-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all ${className || ""}`}>
      <input 
        type="text" 
        placeholder={minPlaceholder} 
        value={formatCurrencyInput(minValue) || ""} 
        onChange={handleMinChange} 
        className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
      />
      <span className="text-muted-foreground">-</span>
      <input 
        type="text" 
        placeholder={maxPlaceholder} 
        value={formatCurrencyInput(maxValue) || ""} 
        onChange={handleMaxChange} 
        className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground text-right"
      />
    </div>
  )
}
