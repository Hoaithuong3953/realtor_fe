import { ChevronsUpDown } from "lucide-react"

import { Avatar } from "@/components/atoms"
import { UserMenu } from "@/components/molecules"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { getUserMenuConfig } from "@/constants/navigation"

type NavUserProps = {
  user: {
    name: string
    email: string
    avatarUrl?: string
    role_code?: string
  }
  onLogout?: () => void
}

export const NavUser = ({ user, onLogout }: NavUserProps) => {
  const { isMobile } = useSidebar()
  const   menuGroups = getUserMenuConfig(onLogout)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          user={user}
          menuGroups={menuGroups}
          side={isMobile ? "bottom" : "right"}
          align="end"
          showAvatarInHeader={true}
          contentClassName="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        >
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar src={user.avatarUrl} name={user.name} size="md" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </UserMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
