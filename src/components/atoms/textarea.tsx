import * as React from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Textarea as PrimitiveTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentProps<typeof PrimitiveTextarea> & {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  containerClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  id,
  className,
  label,
  description,
  error,
  required = false,
  disabled,
  containerClassName,
  ...props
}, ref) => {
  const generatedId = React.useId()
  const textareaId = id ?? `textarea-${generatedId}`
  const hasMeta = !!label || !!description || !!error

  const renderTextarea = () => (
    <PrimitiveTextarea
      ref={ref}
      id={textareaId}
      disabled={disabled}
      className={className}
      aria-invalid={!!error || undefined}
      {...props}
    />
  )

  if (!hasMeta) {
    return renderTextarea()
  }

  return (
    <Field
      data-invalid={!!error}
      data-disabled={disabled}
      className={cn(containerClassName)}
    >
      {label ? (
        <FieldLabel htmlFor={textareaId}>
          <FieldTitle>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </FieldTitle>
        </FieldLabel>
      ) : null}

      <FieldContent>
        {renderTextarea()}
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
    </Field>
  )
})

Textarea.displayName = "Textarea"
