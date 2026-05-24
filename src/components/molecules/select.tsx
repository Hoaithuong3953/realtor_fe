import * as React from "react"
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  disabled?: boolean
  containerClassName?: string
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  className,
  label,
  description,
  error,
  required = false,
  disabled = false,
  containerClassName
}, ref) => {
  const generatedId = React.useId()
  const selectId = `select-${generatedId}`
  const hasMeta = !!label || !!description || !!error

  const renderSelect = () => (
    <UISelect value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger 
        ref={ref}
        id={selectId} 
        className={className} 
        aria-invalid={!!error || undefined}
      >
        <SelectValue placeholder={placeholder} />
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

  if (!hasMeta) {
    return renderSelect()
  }

  return (
    <Field
      data-invalid={!!error}
      data-disabled={disabled}
      className={cn(containerClassName)}
    >
      {label ? (
        <FieldLabel htmlFor={selectId}>
          <FieldTitle>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </FieldTitle>
        </FieldLabel>
      ) : null}

      <FieldContent>
        {renderSelect()}
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
    </Field>
  )
})

Select.displayName = "Select"
