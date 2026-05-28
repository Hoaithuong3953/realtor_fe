import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Plus, Pencil, Trash2, FileUp } from "lucide-react"

import { Button } from "@/components/atoms"
import { Pagination, SearchFilter } from "@/components/molecules"
import { UsersTable, UserFormModal } from "@/components/organisms/users"
import { useUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation, useImportUsersExcelMutation } from "@/hooks/use-users"
import { useRolesQuery } from "@/hooks/use-roles"
import { useQueryParams } from "@/hooks/use-query-params"
import type { UserFormData, UserUiModel } from "@/types/ui/user"
import { type UserCreate, type UserUpdate, USER_STATUSES, type UserImportResponse } from "@/types/api/user"
import { ImportFileModal, ImportResultModal } from "@/components/organisms/common"
import { getImportRowDisplay } from "@/utils/import-formatter"

export default function UsersPage() {
  const { t } = useTranslation(["common", "user"])

  const { apiParams, search, setSearch, page, setPage } = useQueryParams({ defaultSort: "created_at_desc" })

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserUiModel | null>(null)

  const { data, isLoading } = useUsersQuery(apiParams)
  const { data: rolesData, isLoading: isLoadingRoles } = useRolesQuery()
  
  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation(editingUser?.id || 0)
  const { mutate: deleteUser } = useDeleteUserMutation()
  const { mutate: importUsers, isPending: isImporting } = useImportUsersExcelMutation()


  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importResult, setImportResult] = useState<UserImportResponse | null>(null)

  const handleImportSubmit = (file: File) => {
    importUsers(file, {
      onSuccess: (data) => {
        setIsImportModalOpen(false)
        setImportResult(data)
      }
    })
  }

  const handleCreateSubmit = (formData: UserFormData) => {
    if (editingUser) {
      const payload: UserUpdate = {
        full_name: formData.full_name,
        phone: formData.phone,
        role_id: formData.role_id,
        status: formData.status
      }
      updateMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormModalOpen(false)
          setEditingUser(null)
        }
      })
    } else {
      const payload: UserCreate = {
        email: formData.email,
        password: formData.password!,
        full_name: formData.full_name,
        phone: formData.phone,
        role_id: formData.role_id,
        status: formData.status || "active"
      }
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormModalOpen(false)
        }
      })
    }
  }

  const handleDelete = (id: number) => {
    deleteUser(id)
  }

  return (
    <div className="flex flex-col flex-1 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{t("user:list.title")}</h1>
            {data?.total !== undefined && (
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-semibold">
                {data.total}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {t("user:list.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => {
              setImportResult(null)
              setIsImportModalOpen(true)
            }} className="gap-2">
              <FileUp className="w-4 h-4" />
              {t("user:import_modal.title")}
            </Button>
          <Button onClick={() => {
            setEditingUser(null)
            setIsFormModalOpen(true)
          }} className="gap-2">
            <Plus className="w-4 h-4" />
            {t("user:list.add_new_btn")}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <SearchFilter
            placeholder={t("user:list.search_placeholder")}
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      <UsersTable 
        data={(data?.items as unknown as UserUiModel[]) || []} 
        isLoading={isLoading}
        actions={(user) => [
          {
            id: "edit",
            label: t("common:actions.edit"),
            icon: Pencil,
            onClick: () => {
              setEditingUser(user)
              setIsFormModalOpen(true)
            }
          },
          {
            id: "delete",
            label: t("common:actions.delete"),
            icon: Trash2,
            variant: "destructive",
            confirmTitle: t("user:messages.delete_confirm_title"),
            confirmDescription: t("user:messages.delete_confirm_desc"),
            onClick: () => handleDelete(user.id)
          }
        ]}
      />

      {data && data.total > 20 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(data.total / 20)}
            onPageChange={setPage}
          />
        </div>
      )}

      <UserFormModal 
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open)
          if (!open) setEditingUser(null)
        }}
        initialData={editingUser || undefined}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        statusOptions={USER_STATUSES.map(s => ({ label: t(`user:constants.status_${s}`), value: s }))}
        roleOptions={(rolesData || []).map(r => ({ label: r.name, value: String(r.id) }))}
        isLoadingRoles={isLoadingRoles}
      />

      <ImportFileModal
        isOpen={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        title={t("user:import_modal.title")}
        description={t("user:import_modal.description")}
        templateUrl="/templates/User_Import_Template.xlsx"
        isLoading={isImporting}
        onImport={handleImportSubmit}
      />

      <ImportResultModal
        isOpen={!!importResult}
        onOpenChange={(open) => {
          if (!open) setImportResult(null)
        }}
        data={importResult ? {
          total_rows: importResult.total_rows,
          success_rows: importResult.success_rows,
          failed_rows: importResult.failed_rows,
          results: importResult.results.map(r => {
            const display = getImportRowDisplay(r.status, t)
            
            return {
              index: r.index,
              statusLabel: display.label,
              statusColor: display.color,
              statusIcon: display.icon,
              identifier: r.email ?? "N/A",
              message: r.message
            }
          })
        } : null}
      />
    </div>
  )
}
