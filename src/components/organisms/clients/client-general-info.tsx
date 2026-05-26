import { useTranslation } from "react-i18next"
import { Button } from "@/components/atoms"
import { Edit, Phone, Target, FileText } from "lucide-react"

import type { ClientFormData, ClientFieldConfig } from "@/types/ui/client"

interface ClientGeneralInfoProps {
  client: ClientFormData
  onEditClick: () => void
  fieldConfig: ClientFieldConfig[]
}

export const ClientGeneralInfo = ({ client, onEditClick, fieldConfig }: ClientGeneralInfoProps) => {
  const { t } = useTranslation(["client", "common"])

  if (!client) return null

  const getField = (key: keyof ClientFormData) => fieldConfig.find(f => f.key === key)

  const renderField = (key: keyof ClientFormData) => {
    const field = getField(key)
    if (!field) return null
    const rawValue = client[key]
    const displayValue = field.format && rawValue !== null && rawValue !== undefined
      ? field.format(rawValue) 
      : (rawValue || "-")

    return (
      <div key={field.key} className="space-y-1">
        <p className="text-sm text-muted-foreground">{field.label}</p>
        <p className="font-medium break-all">{displayValue}</p>
      </div>
    )
  }

  const renderValueOnly = (key: keyof ClientFormData) => {
    const field = getField(key)
    if (!field) return "-"
    const rawValue = client[key]
    return field.format && rawValue !== null && rawValue !== undefined
      ? field.format(rawValue) 
      : (rawValue || "-")
  }

  // Get initial
  const initial = client.full_name ? client.full_name.charAt(0).toUpperCase() : "?"

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-8">
        {/* Left Column: Profile Avatar & Status */}
        <div className="relative w-full flex flex-col items-center p-6 bg-muted/10 rounded-2xl border">
          {/* Edit Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full w-8 h-8 transition-colors"
            onClick={onEditClick}
            title={t("common:actions.edit")}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center text-4xl font-bold mb-4 shadow-sm">
            {initial}
          </div>
          <h3 className="text-xl font-bold text-center line-clamp-1">{client.full_name}</h3>
          <p className="text-sm font-medium text-muted-foreground mt-1 mb-4">
            {renderValueOnly("customer_type")}
          </p>
          <div>
            <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {renderValueOnly("status")}
            </span>
          </div>
        </div>

        {/* Right Column: Grouped Details */}
        <div className="w-full flex flex-col gap-6">
          
          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 border-b pb-2 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> {t("client:detail.contact_info")}
            </h4>
            <div className="flex flex-col gap-5 bg-muted/10 p-4 rounded-xl border border-border/40">
              {renderField("phone")}
              {renderField("email")}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 border-b pb-2 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> {t("client:detail.requirements")}
            </h4>
            <div className="flex flex-col gap-5 bg-muted/10 p-4 rounded-xl border border-border/40">
              {renderField("goal_type")}
              {renderField("budget_min")}
              {renderField("budget_max")}
            </div>
          </div>

          {/* Summary */}
          {client.summary && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b pb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> {t("form.summary")}
              </h4>
              <div className="bg-muted/10 p-4 rounded-xl text-sm whitespace-pre-wrap border border-border/40 text-muted-foreground">
                {client.summary}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
