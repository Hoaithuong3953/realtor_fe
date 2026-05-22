import * as React from "react"

import { Button as PrimitiveButton, Spinner } from "@/components/ui"
import { cn } from "@/lib/utils"

type ButtonVariant =
  | "solid"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"
type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon"

type ButtonProps = Omit<
  React.ComponentProps<typeof PrimitiveButton>,
  "variant" | "size"
> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const sizeMap = {
  xs: "xs",
  sm: "sm",
  md: "default",
  lg: "lg",
  icon: "icon",
} as const

const variantMap = {
  solid: "default",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
  link: "link",
} as const

const semanticClasses = {
  link: "text-link hover:text-link-hover",
} as const

export const Button = ({
  className,
  variant = "solid",
  size = "md",
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading
  const isIconSize = size === "icon"
  const primitiveVariant = variantMap[variant]
  const primitiveSize = sizeMap[size]
  const iconContent =
    leftIcon ?? rightIcon ?? (React.isValidElement(children) ? children : null)
  const customSemanticClass =
    semanticClasses[variant as keyof typeof semanticClasses] || ""

  let content: React.ReactNode

  if (props.asChild) {
    content = children
  } else if (isLoading) {
    content = (
      <>
        <Spinner data-icon="inline-start" />
        {!isIconSize ? (loadingText ?? children) : null}
      </>
    )
  } else if (isIconSize) {
    content = iconContent
  } else {
    content = (
      <>
        {leftIcon ? <span data-icon="inline-start">{leftIcon}</span> : null}
        {children}
        {rightIcon ? <span data-icon="inline-end">{rightIcon}</span> : null}
      </>
    )
  }

  return (
    <PrimitiveButton
      variant={primitiveVariant}
      size={primitiveSize}
      className={cn(fullWidth && "w-full", customSemanticClass, className)}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {content}
    </PrimitiveButton>
  )
}

export type { ButtonProps, ButtonSize, ButtonVariant }
