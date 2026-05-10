import * as React from "react"

import {
  Avatar as PrimitiveAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type AvatarProps = Omit<React.ComponentProps<typeof PrimitiveAvatar>, "size"> & {
  src?: string
  name?: string
  fallback?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  rounded?: boolean
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
  xl: "h-12 w-12 text-lg",
} as const

function getInitials(name: string) {
  if (!name) {return "U"}
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {return parts[0].substring(0, 2).toUpperCase()}
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Avatar({
  src,
  name = "",
  fallback,
  size = "md",
  rounded = true,
  className,
  ...props
}: AvatarProps) {
  const roundedClass = rounded ? "rounded-full" : "rounded-md"

  return (
    <PrimitiveAvatar
      className={cn(sizeClasses[size], roundedClass, className)}
      {...props}
    >
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={cn(roundedClass, "bg-primary/10 text-primary font-medium")}>
        {fallback || getInitials(name)}
      </AvatarFallback>
    </PrimitiveAvatar>
  )
}

export { Avatar }
