import {
  Building2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
  UserCog,
  Users,
} from "lucide-react"

import type { UserMenuItemType } from "@/components/molecules"
import type { NavGroup } from "@/types/ui"
import { paths } from "@/routes/paths"

export const navigationConfig: NavGroup[] = [
  {
    label: "nav.overview",
    items: [
      {
        title: "nav.dashboard",
        url: paths.dashboard.root,
        icon: LayoutDashboard,
        isActive: true,
      },
    ],
  },
  {
    label: "nav.management",
    items: [
      {
        title: "nav.properties",
        url: paths.dashboard.properties,
        icon: Building2,
        items: [
          { title: "nav.properties_list", url: paths.dashboard.properties },
          {
            title: "nav.properties_create",
            url: `${paths.dashboard.properties}/create`,
          },
          {
            title: "nav.properties_import",
            url: `${paths.dashboard.properties}/import-jobs`,
          },
        ],
      },
      {
        title: "nav.clients",
        url: paths.dashboard.clients,
        icon: Users,
        items: [
          { title: "nav.clients_list", url: paths.dashboard.clients },
          {
            title: "nav.clients_create",
            url: `${paths.dashboard.clients}/create`,
          },
        ],
      },
    ],
  },
  {
    label: "nav.ai",
    items: [
      {
        title: "nav.chat",
        url: paths.dashboard.chat,
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "nav.system",
    items: [
      {
        title: "nav.users",
        url: paths.dashboard.users,
        icon: UserCog,
      },
      {
        title: "nav.roles",
        url: paths.dashboard.roles,
        icon: ShieldCheck,
      },
    ],
  },
]

export const getUserMenuConfig = (
  onLogout?: () => void,
): UserMenuItemType[][] => [
  [
    { title: "user_menu.profile", icon: User },
    { title: "user_menu.settings", icon: Settings },
  ],
  [
    {
      title: "user_menu.logout",
      icon: LogOut,
      onClick: onLogout,
      destructive: true,
    },
  ],
]
