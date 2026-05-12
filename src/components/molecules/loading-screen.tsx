import { Spinner } from "@/components/ui/spinner"

/**
 * LoadingScreen is a full-screen loading placeholder component.
 * It centers a spinner on the screen with the application background.
 */
export const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Spinner className="size-8 text-primary" />
    </div>
  )
}
