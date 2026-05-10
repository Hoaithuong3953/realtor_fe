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

export type UserMenuItemType = {
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
  }
  menuGroups?: UserMenuItemType[][]
  children?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

function UserMenu({ user, menuGroups, children, side = "bottom", align = "end" }: UserMenuProps) {
  const { t } = useTranslation("common")

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
      <DropdownMenuContent className="w-56" align={align} side={side} sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar src={user.avatarUrl} name={user.name} size="md" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {menuGroups?.map((group, index) => (
          <React.Fragment key={index}>
            <DropdownMenuSeparator />
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

export { UserMenu }
