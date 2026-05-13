import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider } from "react-router-dom"

import { Toaster } from "@/components/atoms"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap"
import { queryClient } from "@/lib/query-client"
import { router } from "@/routes/router"
import { setupAuthInterceptors } from "@/services/auth-interceptor"

// Register and configure HTTP interceptors immediately on application load
setupAuthInterceptors()

function App() {
  // Delegate all background synchronization, startup validation and session listeners to custom hook
  useAuthBootstrap()

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
