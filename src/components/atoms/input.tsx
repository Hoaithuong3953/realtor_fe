import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type InputProps = Omit<React.ComponentProps<typeof InputGroupInput>, "prefix" | "suffix"> & {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  containerClassName?: string
}

function Input({
  id,
  className,
  label,
  description,
  error,
  required = false,
  prefix,
  suffix,
  disabled,
  containerClassName,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? `input-${generatedId}`
  const [showPassword, setShowPassword] = React.useState(false)

  const isPassword = props.type === "password"
  const inputType = isPassword && showPassword ? "text" : props.type
  const hasMeta = !!label || !!description || !!error

  const renderInput = () => (
    <InputGroup className={className} aria-invalid={!!error || undefined}>
      {prefix ? (
        <InputGroupAddon align="inline-start">
          {typeof prefix === "string" ? <InputGroupText>{prefix}</InputGroupText> : prefix}
        </InputGroupAddon>
      ) : null}

      <InputGroupInput
        id={inputId}
        disabled={disabled}
        {...props}
        type={inputType}
      />

      {(suffix || isPassword) ? (
        <InputGroupAddon align="inline-end">
          {suffix ? (typeof suffix === "string" ? <InputGroupText>{suffix}</InputGroupText> : suffix) : null}
          {isPassword ? (
            <InputGroupButton
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          ) : null}
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )

  if (!hasMeta) {
    return renderInput()
  }

  return (
    <Field
      data-invalid={!!error}
      data-disabled={disabled}
      className={cn(containerClassName)}
    >
      {label ? (
        <FieldLabel htmlFor={inputId}>
          <FieldTitle>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </FieldTitle>
        </FieldLabel>
      ) : null}

      <FieldContent>
        {renderInput()}
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
    </Field>
  )
}

export { Input }
export type { InputProps }
