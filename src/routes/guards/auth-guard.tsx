import * as React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"
import { paths } from "@/routes/paths"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard protects private routes from unauthenticated users
 * Redirects to login and preserves the attempted URL in location state
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />
  }

  return <>{children}</>
}
