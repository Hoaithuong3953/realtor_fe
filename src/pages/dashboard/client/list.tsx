import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useNavigate, generatePath } from "react-router-dom"
import { paths } from "@/routes/paths"

import { 
  useClientsQuery, 
  useDeleteClientMutation,
  useCreateClientMutation,
  useUpdateClientMutation
} from "@/hooks/use-clients"
import { useQueryParams } from "@/hooks/use-query-params"
import { Button } from "@/components/atoms"
import { Pagination, SortDropdown, SearchFilter } from "@/components/molecules"
import { ClientFormModal, ClientsTable } from "@/components/organisms/clients"
import { type ClientFormData } from "@/types/ui/"
import { CLIENT_TYPES, CLIENT_GOAL_TYPES, CLIENT_STATUSES } from "@/types/api"
import { CLIENT_SORT_OPTIONS } from "@/constants/client"

export default function ClientsPage() {
  const { t } = useTranslation(["client", "common"])
  const navigate = useNavigate()
  
  const { apiParams, search, setSearch, page, setPage, sortValue, setSortValue } = useQueryParams({ defaultSort: "updated_at_desc" })
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<(ClientFormData & { id: number }) | null>(null)

  const { mutate: deleteClient } = useDeleteClientMutation()
  const createMutation = useCreateClientMutation()
  const updateMutation = useUpdateClientMutation(editingClient?.id || 0)

  const handleCreateSubmit = (data: ClientFormData) => {
    if (editingClient) {
      updateMutation.mutate(data, {
        onSuccess: () => {
          setIsFormModalOpen(false)
          setEditingClient(null)
        }
      })
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsFormModalOpen(false)
      })
    }
  }

  const { data, isLoading } = useClientsQuery(apiParams)

  const handleDelete = (id: number) => {
    if (window.confirm(t("messages.delete_confirm_desc"))) {
      deleteClient(id)
    }
  }

  return (
    <div className="flex flex-col flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{t("list.title")}</h1>
            {data?.total !== undefined && (
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-sm font-semibold">
                {data.total}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">{t("list.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => {
            setEditingClient(null)
            setIsFormModalOpen(true)
          }} className="gap-2">
            <Plus className="w-4 h-4" />
            {t("list.add_new_btn")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <SearchFilter
            placeholder={t("list.search_placeholder")}
            value={search}
            onChange={setSearch}
          />
        </div>
        
        <SortDropdown 
          options={CLIENT_SORT_OPTIONS.map(opt => ({ ...opt, label: t(`common:${opt.label}`) }))}
          value={sortValue}
          onChange={setSortValue}
          placeholder={t("common:sort.title")}
        />
      </div>

      {/* Table */}
      <ClientsTable 
        data={data?.items || []} 
        isLoading={isLoading} 
        onRowClick={(client) => navigate(generatePath(paths.dashboard.clients.detail, { id: String(client.id) }))}
        actions={(client) => [
          {
            id: "edit",
            label: t("common:actions.edit"),
            icon: Pencil,
            onClick: (e) => {
              e.stopPropagation()
              setEditingClient(client)
              setIsFormModalOpen(true)
            }
          },
          {
            id: "delete",
            label: t("common:actions.delete"),
            icon: Trash2,
            variant: "destructive",
            onClick: (e) => {
              e.stopPropagation()
              handleDelete(client.id)
            }
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

      <ClientFormModal 
        open={isFormModalOpen} 
        onOpenChange={(open) => {
          setIsFormModalOpen(open)
          if (!open) setEditingClient(null)
        }} 
        initialData={editingClient || undefined}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        typeOptions={CLIENT_TYPES.map(t_ => ({ label: t(`constants.type_${t_}`), value: t_ }))}
        goalOptions={CLIENT_GOAL_TYPES.map(g => ({ label: t(`constants.goal_${g}`), value: g }))}
        statusOptions={CLIENT_STATUSES.map(s => ({ label: t(`constants.status_${s}`), value: s }))}
      />
    </div>
  )
}
