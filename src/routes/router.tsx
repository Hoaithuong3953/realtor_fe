import * as React from "react"
import { createBrowserRouter } from "react-router-dom"

import { LoadingScreen } from "@/components/molecules"
import { ErrorLayout } from "@/layouts/error-layout"
import { paths } from "@/routes/paths"
import { AuthLayout } from "@/layouts/auth-layout"

// Lazy load page components
const NotFoundPage = React.lazy(() => import("@/pages/errors/not-found"))
const ForbiddenPage = React.lazy(() => import("@/pages/errors/forbidden"))
const InternalErrorPage = React.lazy(() => import("@/pages/errors/internal-error"))
const MaintenancePage = React.lazy(() => import("@/pages/errors/maintenance"))

const LoginPage = React.lazy(() => import("@/pages/auth/login"))
const ForgotPasswordPage = React.lazy(() => import("@/pages/auth/forgot-password"))
const ResetPasswordPage = React.lazy(() => import("@/pages/auth/reset-password"))

// Helper function to render lazy-loaded components with Suspense
const lazyLoad = (Component: React.ComponentType<object>, props = {}) => (
  <React.Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </React.Suspense>
)

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: paths.auth.login, element: lazyLoad(LoginPage) },
      { path: paths.auth.forgotPassword, element: lazyLoad(ForgotPasswordPage) },
      { path: paths.auth.resetPassword, element: lazyLoad(ResetPasswordPage) },
    ]
  },
  {
    element: <ErrorLayout />,
    children: [
      { path: paths.errors.forbidden, element: lazyLoad(ForbiddenPage) },
      { path: paths.errors.serverError, element: lazyLoad(InternalErrorPage) },
      { path: paths.errors.maintenance, element: lazyLoad(MaintenancePage) },
      { path: "*", element: lazyLoad(NotFoundPage) },
    ],
  },
])
