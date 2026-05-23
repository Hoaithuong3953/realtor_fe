import { Outlet } from "react-router-dom"
import { RouteErrorBoundary } from "@/components/atoms/route-error-boundary"

import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/organisms/dashboard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <RouteErrorBoundary>
            <Outlet />
          </RouteErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}