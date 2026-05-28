import { BrainCircuit, RefreshCw, User, ClipboardList, MapPin, DollarSign, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/atoms"
import { Drawer, ConfirmDialog } from "@/components/molecules"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { ClientResponse } from "@/types/api/client"
import type { AggregatedMemoryResponse } from "@/types/api/chat"
import { formatPrice } from "@/utils/currency-formatter"

type ChatMemoryProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  activeClient: ClientResponse | null
  aggregatedMemory: AggregatedMemoryResponse | null
  onInitialize: () => void
  onReset: () => void
  isInitializing?: boolean
}

export const ChatMemory = ({ 
  isOpen, 
  onOpenChange, 
  activeClient,
  aggregatedMemory,
  onInitialize, 
  onReset,
  isInitializing
}: ChatMemoryProps) => {
  const { t: tChat } = useTranslation("chat")
  const { t: tCommon } = useTranslation("common")
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    setShowResetConfirm(false)
    onReset?.()
  }

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onOpenChange}
      side="right"
      className="w-full sm:max-w-xl data-[side=right]:sm:max-w-xl flex flex-col p-0 gap-0"
      hideCloseButton={false}
      title={
        <div className="flex items-center gap-2 text-primary w-full pr-8">
          <BrainCircuit className="size-5" />
          <span className="flex-1 text-left">{tChat("components.memory_title", { defaultValue: "Hồ sơ & Ký ức" })}</span>
        </div>
      }
    >
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/10 border-t">
        <Tabs defaultValue="client" className="flex-1 flex flex-col h-full">
          <div className="px-4 pt-4 pb-2 bg-background border-b z-10">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client">{tChat("components.memory_tab_client")}</TabsTrigger>
              <TabsTrigger value="ai">{tChat("components.memory_tab_ai")}</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Tab 1: Client Info */}
            <TabsContent value="client" className="m-0 p-4 space-y-4 outline-none">
              {!activeClient ? (
                <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
                  <User className="size-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">{tChat("components.memory_empty_client")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-background rounded-xl p-4 border space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <User className="size-4" />
                      {tChat("components.memory_client_general_info")}
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                      <span className="text-muted-foreground">Họ tên:</span>
                      <span className="font-medium">{activeClient.full_name}</span>
                      <span className="text-muted-foreground">SĐT:</span>
                      <span>{activeClient.phone || "Trống"}</span>
                      <span className="text-muted-foreground">Email:</span>
                      <span>{activeClient.email || "Trống"}</span>
                    </div>
                  </div>

                  <div className="bg-background rounded-xl p-4 border space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <DollarSign className="size-4" />
                      Ngân sách
                    </div>
                    <div className="text-sm">
                      {activeClient.budget_min || activeClient.budget_max 
                        ? `${activeClient.budget_min ? formatPrice(activeClient.budget_min) : "0"} - ${activeClient.budget_max ? formatPrice(activeClient.budget_max) : "Không giới hạn"}`
                        : "Chưa xác định"}
                    </div>
                  </div>

                  <div className="bg-background rounded-xl p-4 border space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <ClipboardList className="size-4" />
                      Nhu cầu gốc
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {activeClient.summary || "Chưa có ghi chú nhu cầu."}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Tab 2: AI Memory */}
            <TabsContent value="ai" className="m-0 p-4 space-y-4 outline-none">
              <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10 mb-2">
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  <Sparkles className="size-4" />
                  AI Tự động đúc kết
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="xs" 
                    className="h-8 text-xs border-destructive/20 text-destructive hover:bg-destructive/10" 
                    onClick={() => setShowResetConfirm(true)}
                  >
                    {tChat("components.memory_btn_reset")}
                  </Button>
                  <Button 
                    variant="solid" 
                    size="xs" 
                    className="h-8 text-xs gap-1.5" 
                    onClick={onInitialize}
                    disabled={isInitializing}
                  >
                    {isInitializing ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
                    {tChat("components.memory_btn_refresh")}
                  </Button>
                </div>
              </div>

              {!aggregatedMemory ? (
                <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
                  <BrainCircuit className="size-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    {tChat("components.memory_empty_ai_title")}<br/>{tChat("components.memory_empty_ai_desc")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* AI Consolidated Requirements */}
                  <div className="bg-background rounded-xl p-4 border border-border shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary border-b pb-2">
                      <ClipboardList className="size-4" />
                      {tChat("components.memory_ai_requirements")}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="size-3.5"/> {tChat("components.memory_ai_budget")}:</span>
                        <p className="font-medium pl-5">{aggregatedMemory.consolidated_requirements?.budget_range || tChat("components.memory_ai_no_data")}</p>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3.5"/> {tChat("components.memory_ai_location")}:</span>
                        <div className="pl-5 flex flex-wrap gap-1.5">
                          {aggregatedMemory.consolidated_requirements?.locations?.length ? (
                            aggregatedMemory.consolidated_requirements.locations.map((loc, idx) => (
                              <span key={idx} className="bg-secondary px-2 py-0.5 rounded-md text-xs font-medium">{loc}</span>
                            ))
                          ) : (
                            <span className="font-medium">{tChat("components.memory_ai_no_data")}</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5"><BrainCircuit className="size-3.5"/> {tChat("components.memory_ai_property_details")}:</span>
                        <p className="font-medium pl-5">{aggregatedMemory.consolidated_requirements?.property_details || tChat("components.memory_ai_no_data")}</p>
                      </div>

                      <div className="space-y-1 text-sm pt-2 border-t">
                        <span className="text-muted-foreground">{tChat("components.memory_ai_special_notes")}:</span>
                        <p className="italic text-foreground/80 mt-1">{aggregatedMemory.consolidated_requirements?.special_notes || tChat("components.memory_ai_empty_notes")}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Summary Status */}
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <AlertCircle className="size-4" />
                      {tChat("components.memory_ai_status")}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {aggregatedMemory.summary_status || tChat("components.memory_ai_empty_status")}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        title={tChat("components.memory_reset_title")}
        description={tChat("components.memory_reset_desc")}
        onConfirm={handleReset}
        confirmVariant="destructive"
        cancelText={tCommon("actions.cancel")}
        confirmText={tCommon("actions.reset")}
      />
    </Drawer>
  )
}
