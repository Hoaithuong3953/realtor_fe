import { NavMain, NavUser, TeamSwitcher } from "@/components/molecules"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getNavigationConfig } from "@/constants/navigation"
import { useLogoutMutation } from "@/hooks/use-auth"
import { useAuthStore } from "@/store/auth.store"

export const DashboardSidebar = (
  props: React.ComponentProps<typeof Sidebar>,
) => {
  const user = useAuthStore((state) => state.user)
  const avatarUrl = useAuthStore((state) => state.avatarUrl)
  const { mutate: logout } = useLogoutMutation()

  const userData = {
    name: user?.full_name ?? "User",
    email: user?.email ?? "",
    avatarUrl: avatarUrl ?? undefined,
    role_code: user?.role_code ?? undefined,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={getNavigationConfig()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onLogout={() => logout()} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
