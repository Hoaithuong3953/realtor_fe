import * as React from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Avatar } from "@/components/atoms"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserMenuItemType = {
  title: string
  icon?: React.ElementType
  url?: string
  onClick?: () => void
  destructive?: boolean
}

type UserMenuProps = {
  user: {
    name: string
    email: string
    avatarUrl?: string
    role_code?: string
  }
  menuGroups?: UserMenuItemType[][]
  children?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  showHeader?: boolean
  showAvatarInHeader?: boolean
  contentClassName?: string
}

export const UserMenu = ({
  user,
  menuGroups,
  children,
  side = "bottom",
  align = "end",
  showHeader = true,
  showAvatarInHeader = false,
  contentClassName = "w-56",
}: UserMenuProps) => {
  const { t } = useTranslation("dashboard")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? (
          children
        ) : (
          <button
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("aria.open_user_menu")}
          >
            <Avatar src={user.avatarUrl} name={user.name} size="md" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={contentClassName}
        align={align}
        side={side}
        sideOffset={4}
      >
        {showHeader && (
          <DropdownMenuLabel className="p-0 font-normal">
            <div
              className={`flex ${showAvatarInHeader ? "items-center gap-2 px-1 py-1.5" : "flex-col gap-1 px-3 py-2"} text-left text-sm`}
            >
              {showAvatarInHeader && (
                <Avatar src={user.avatarUrl} name={user.name} size="md" />
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{user.name}</span>
                  {user.role_code && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground font-medium">
                      {user.role_code}
                    </span>
                  )}
                </div>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        )}
        {menuGroups?.map((group, index) => (
          <React.Fragment key={index}>
            {(showHeader || index > 0) && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {group.map((item, itemIndex) => {
                const isLink = !!item.url
                const itemContent = (
                  <>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {t(item.title)}
                  </>
                )
                const itemClassName = item.destructive
                  ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                  : ""

                return isLink ? (
                  <DropdownMenuItem
                    key={itemIndex}
                    className={itemClassName}
                    asChild
                  >
                    <Link to={item.url!} onClick={item.onClick}>
                      {itemContent}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    key={itemIndex}
                    className={itemClassName}
                    onClick={item.onClick}
                  >
                    {itemContent}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export type { UserMenuItemType }
