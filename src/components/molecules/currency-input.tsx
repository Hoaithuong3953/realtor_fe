import * as React from "react"
import { Input } from "@/components/atoms"
import { formatCurrencyInput, parseCurrencyInput } from "@/utils/currency-formatter"

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | null | undefined
  onChange: (value: number | null) => void
  label?: string
  error?: string
  containerClassName?: string
}

export const CurrencyInput = ({ 
  value, 
  onChange, 
  label, 
  error, 
  containerClassName,
  ...props 
}: CurrencyInputProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseCurrencyInput(e.target.value)
    if (parsed !== undefined) {
      onChange(parsed)
    }
  }

  return (
    <Input
      type="text"
      label={label}
      error={error}
      value={formatCurrencyInput(value)}
      onChange={handleChange}
      containerClassName={containerClassName}
      {...props}
    />
  )
}
