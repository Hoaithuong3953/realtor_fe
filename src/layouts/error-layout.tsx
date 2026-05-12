import * as React from "react"
import { Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"

type ErrorLayoutProps = {
  children?: React.ReactNode
  className?: string
}

export function ErrorLayout({ children, className }: ErrorLayoutProps) {
  return (
    <main 
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center", 
        className
      )}
    >
      {children || <Outlet />}
    </main>
  )
}
