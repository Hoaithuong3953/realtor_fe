import { Toaster as PrimitiveToaster } from "@/components/ui/sonner"

export function Toaster() {
  return (
    <PrimitiveToaster
      position="top-right"
      expand={false}
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "group toast backdrop-blur-md rounded-[var(--radius)] font-sans border relative overflow-hidden after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:bg-current after:opacity-35 after:rounded-b-[var(--radius)] after:animate-[toast-progress_4s_linear_forwards] hover:after:[animation-play-state:paused]",
          success: "bg-success/8! text-success! border-success/25!",
          error: "bg-destructive/8! text-destructive! border-destructive/25!",
          warning: "bg-warning/8! text-warning! border-warning/25!",
          info: "bg-info/8! text-info! border-info/25!",
        }
      }}
    />
  )
}
