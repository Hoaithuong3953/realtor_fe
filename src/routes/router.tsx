import * as React from "react"
import { createBrowserRouter } from "react-router-dom"

import { LoadingScreen } from "@/components/molecules"
import { AuthLayout } from "@/layouts/auth-layout"
import { DashboardLayout } from "@/layouts/dashboard-layout"
import { ErrorLayout } from "@/layouts/error-layout"
import { AuthGuard } from "@/routes/guards/auth-guard"
import { GuestGuard } from "@/routes/guards/guest-guard"
import { paths } from "@/routes/paths"

// Lazy load page components
const NotFoundPage = React.lazy(() => import("@/pages/errors/not-found"))
const ForbiddenPage = React.lazy(() => import("@/pages/errors/forbidden"))
const InternalErrorPage = React.lazy(() => import("@/pages/errors/internal-error"))
const MaintenancePage = React.lazy(() => import("@/pages/errors/maintenance"))

const LoginPage = React.lazy(() => import("@/pages/auth/login"))
const ForgotPasswordPage = React.lazy(() => import("@/pages/auth/forgot-password"))
const ResetPasswordPage = React.lazy(() => import("@/pages/auth/reset-password"))

const DashboardHomePage = React.lazy(() => import("@/pages/dashboard/dashboard"))
const PropertiesPage = React.lazy(() => import("@/pages/dashboard/properties"))
const ClientsPage = React.lazy(() => import("@/pages/dashboard/clients"))
const ChatPage = React.lazy(() => import("@/pages/dashboard/chat"))
const UsersPage = React.lazy(() => import("@/pages/dashboard/users"))
const RolesPage = React.lazy(() => import("@/pages/dashboard/roles"))
const SettingsPage = React.lazy(() => import("@/pages/dashboard/settings"))

// Helper function to render lazy-loaded components with Suspense
const lazyLoad = (Component: React.ComponentType<object>, props = {}) => (
  <React.Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </React.Suspense>
)

export const router = createBrowserRouter([
  // Dashboard routes — protected by AuthGuard
  {
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: paths.dashboard.root, element: lazyLoad(DashboardHomePage) },
      { path: paths.dashboard.properties, element: lazyLoad(PropertiesPage) },
      {
        path: `${paths.dashboard.properties}/create`,
        element: lazyLoad(PropertiesPage),
      },
      {
        path: `${paths.dashboard.properties}/import-jobs`,
        element: lazyLoad(PropertiesPage),
      },
      { path: paths.dashboard.clients, element: lazyLoad(ClientsPage) },
      {
        path: `${paths.dashboard.clients}/create`,
        element: lazyLoad(ClientsPage),
      },
      { path: paths.dashboard.chat, element: lazyLoad(ChatPage) },
      { path: paths.dashboard.users, element: lazyLoad(UsersPage) },
      { path: paths.dashboard.roles, element: lazyLoad(RolesPage) },
      { path: paths.dashboard.settings, element: lazyLoad(SettingsPage) },
    ],
  },
  // Auth routes — only accessible when NOT logged in
  {
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      { path: paths.auth.login, element: lazyLoad(LoginPage) },
      { path: paths.auth.forgotPassword, element: lazyLoad(ForgotPasswordPage) },
      { path: paths.auth.resetPassword, element: lazyLoad(ResetPasswordPage) },
    ],
  },
  // Error routes — always accessible
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
