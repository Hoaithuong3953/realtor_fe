import * as React from "react"
import { Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"
import { LanguageSwitcher, ThemeToggle } from "@/components/molecules"

type ErrorLayoutProps = {
  children?: React.ReactNode
  className?: string
}

export function ErrorLayout({ children, className }: ErrorLayoutProps) {
  return (
    <main 
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center relative", 
        className
      )}
    >
      <div className="absolute top-4 right-4 z-50 flex items-center gap-1">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      {children || <Outlet />}
    </main>
  )
}
