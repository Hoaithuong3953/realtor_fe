import * as React from "react"
import { Home, MessageSquare, Plus, UserPlus, Edit2, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Button, Input } from "@/components/atoms"
import { TeamSwitcher, NavUser, ActionDropdown } from "@/components/molecules"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui"
import { paths } from "@/routes/paths"
import { useAuthStore } from "@/store/auth.store"
import { useLogoutMutation } from "@/hooks/use-auth"
import { useTranslation } from "react-i18next"
import { getDateGroupKey } from "@/utils/date-formatter"
import { useDeleteChatSessionMutation, useUpdateChatSessionMutation } from "@/hooks/use-chat"
import { useCreateClientMutation } from "@/hooks/use-clients"
import { ClientFormModal } from "@/components/organisms/clients"
import { type ClientFormData } from "@/types/ui"
import { CLIENT_TYPES, CLIENT_GOAL_TYPES, CLIENT_STATUSES } from "@/types/api"
export type ChatSidebarSession = {
  id: string | number
  title: string
  updatedAt: string
}

type ChatSidebarProps = React.ComponentProps<typeof Sidebar> & {
  sessions?: ChatSidebarSession[]
  activeSessionId?: string
  onNewChat?: () => void
}

function ChatSidebarSessionItem({ 
  session, 
  isActive 
}: { 
  session: ChatSidebarSession; 
  isActive: boolean 
}) {
  const { t } = useTranslation("chat")
  const navigate = useNavigate()
  
  const { mutate: deleteSession } = useDeleteChatSessionMutation()
  const { mutate: updateSession, isPending: isUpdating } = useUpdateChatSessionMutation(session.id)
  
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState(session.title)

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || newTitle === session.title) {
      setIsRenameModalOpen(false)
      return
    }
    updateSession({ title: newTitle.trim() }, {
      onSuccess: () => {
        setIsRenameModalOpen(false)
      }
    })
  }

  const handleDelete = () => {
    deleteSession(session.id, {
      onSuccess: () => {
        if (isActive) {
          void navigate(paths.dashboard.chat)
        }
      }
    })
  }

  return (
    <>
      <SidebarMenuItem className="group relative flex items-center">
        <SidebarMenuButton asChild isActive={isActive} className="pr-8 w-full">
          <Link to={`${paths.dashboard.chat}/${session.id}`}>
            <MessageSquare className="size-4 shrink-0" />
            <span className="truncate">{session.title || t("layout.sidebar_new_chat")}</span>
          </Link>
        </SidebarMenuButton>

        <div className="absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionDropdown
            actions={[
              {
                id: "rename",
                label: t("actions.rename", { ns: "common" }),
                icon: Edit2,
                onClick: () => {
                  setNewTitle(session.title)
                  setIsRenameModalOpen(true)
                }
              },
              {
                id: "delete",
                label: t("actions.delete", { ns: "common" }),
                icon: Trash2,
                danger: true,
                confirmTitle: t("messages.delete_session_confirm_title", { defaultValue: "Xoá đoạn chat này?" }),
                confirmDescription: t("messages.delete_session_confirm_desc", { defaultValue: "Đoạn chat này sẽ bị xoá vĩnh viễn và không thể khôi phục." }),
                onClick: handleDelete
              }
            ]}
          />
        </div>
      </SidebarMenuItem>

      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("messages.rename_session_title", { defaultValue: "Đổi tên đoạn chat" })}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRename}>
            <div className="py-4">
              <Input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t("messages.rename_session_placeholder", { defaultValue: "Nhập tên mới..." })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRenameModalOpen(false)}>
                {t("actions.cancel", { ns: "common" })}
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? t("actions.saving", { ns: "common", defaultValue: "Đang lưu..." }) : t("actions.save", { ns: "common" })}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const ChatSidebar = ({
  sessions = [],
  activeSessionId,
  onNewChat,
  ...props
}: ChatSidebarProps) => {
  const { t } = useTranslation("chat")
  const user = useAuthStore((state) => state.user)
  const avatarUrl = useAuthStore((state) => state.avatarUrl)
  const { mutate: logout } = useLogoutMutation()

  const userData = {
    name: user?.full_name ?? "User",
    email: user?.email ?? "",
    avatarUrl: avatarUrl ?? undefined,
    role_code: user?.role_code ?? undefined,
  }

  const [isAddClientOpen, setIsAddClientOpen] = React.useState(false)
  const { t: tClient } = useTranslation("client")
  const createMutation = useCreateClientMutation()

  const handleCreateSubmit = (data: ClientFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => setIsAddClientOpen(false)
    })
  }

  // Group sessions
  const groupedSessions = sessions.reduce((acc, session) => {
    const groupKey = getDateGroupKey(session.updatedAt)
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(session)
    return acc
  }, {} as Record<string, ChatSidebarSession[]>)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      
      <SidebarContent>
        <div className="p-4 pb-2">
          <Button fullWidth onClick={onNewChat} leftIcon={<Plus className="size-4" />}>
            {t("layout.sidebar_new_chat")}
          </Button>
        </div>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={paths.dashboard.root}>
                  <Home className="size-4" />
                  <span>{t("layout.sidebar_back_to_dashboard")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsAddClientOpen(true)}>
                <UserPlus className="size-4" />
                <span>{t("layout.sidebar_add_client")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        
        {Object.entries(groupedSessions).map(([group, items]) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{t(`constants.time_${group}`)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((session) => (
                  <ChatSidebarSessionItem 
                    key={session.id} 
                    session={session} 
                    isActive={session.id.toString() === activeSessionId} 
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onLogout={() => logout()} />
      </SidebarFooter>
      <SidebarRail />

      <ClientFormModal 
        open={isAddClientOpen} 
        onOpenChange={setIsAddClientOpen} 
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
        typeOptions={CLIENT_TYPES.map(t_ => ({ label: tClient(`constants.type_${t_}`), value: t_ }))}
        goalOptions={CLIENT_GOAL_TYPES.map(g => ({ label: tClient(`constants.goal_${g}`), value: g }))}
        statusOptions={CLIENT_STATUSES.map(s => ({ label: tClient(`constants.status_${s}`), value: s }))}
      />
    </Sidebar>
  )
}
