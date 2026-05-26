import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Textarea } from "@/components/atoms"
import { Select, type SelectOption } from "@/components/molecules/select"

export interface InteractionFormData {
  type: string
  content: string
}

export interface InteractionFormProps {
  onSubmitInteraction: (data: InteractionFormData) => void
  isPending?: boolean
  typeOptions: SelectOption[]
  defaultType?: string
}

export const InteractionForm = ({ 
  onSubmitInteraction, 
  isPending, 
  typeOptions, 
  defaultType = "note" 
}: InteractionFormProps) => {
  const { t } = useTranslation(["client"])

  const [newInteraction, setNewInteraction] = useState<InteractionFormData>({
    type: defaultType,
    content: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInteraction.content.trim()) return

    onSubmitInteraction(newInteraction)
    setNewInteraction({ type: defaultType, content: "" })
  }

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-medium text-sm">{t("timeline.add_interaction")}</h3>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <Select 
              value={newInteraction.type} 
              onChange={(v) => setNewInteraction({ ...newInteraction, type: v })}
              options={typeOptions}
              containerClassName="w-48"
            />
          </div>
          <div className="flex-1">
            <Textarea 
              value={newInteraction.content}
              onChange={e => setNewInteraction(prev => ({ ...prev, content: e.target.value }))}
              placeholder={t("timeline.placeholder")}
              rows={2}
              className="resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || !newInteraction.content.trim()}>
            {isPending ? t("timeline.btn_sending") : t("timeline.btn_send")}
          </Button>
        </div>
      </form>
    </div>
  )
}
