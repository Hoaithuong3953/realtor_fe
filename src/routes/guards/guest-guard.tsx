import * as React from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"
import { paths } from "@/routes/paths"
import { logger } from "@/utils/logger"

interface GuestGuardProps {
  children: React.ReactNode
}

/**
 * GuestGuard prevents authenticated users from accessing public/auth pages
 * like Login, Forgot Password and Reset Password
 */
export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  if (isAuthenticated) {
    logger.info("User already logged in. Redirecting from public page to home", { 
      email: user?.email,
      userId: user?.id 
    });
    return <Navigate to={paths.home} replace />
  }

  return <>{children}</>
}
