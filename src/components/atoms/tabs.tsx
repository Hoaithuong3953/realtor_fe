import * as React from "react"
import { 
  Tabs as UITabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface TabItem {
  value: string
  label: React.ReactNode
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: "default" | "line"
  className?: string
  listClassName?: string
  contentClassName?: string
  orientation?: "horizontal" | "vertical"
}

export const Tabs = ({
  items,
  defaultValue,
  value,
  onValueChange,
  variant = "line",
  className,
  listClassName,
  contentClassName,
  orientation = "horizontal"
}: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || items[0]?.value)

  const currentTab = value !== undefined ? value : activeTab
  const handleTabChange = (val: string) => {
    setActiveTab(val)
    onValueChange?.(val)
  }

  return (
    <UITabs
      value={currentTab}
      onValueChange={handleTabChange}
      orientation={orientation}
      className={cn("w-full flex flex-col", className)}
    >
      <div className={cn(variant === "line" && "border-b border-border w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]")}>
        <TabsList variant={variant} className={cn(
          variant === "line" && "w-full justify-start rounded-none p-0 pb-[5px] h-auto gap-8 bg-transparent",
          listClassName
        )}>
          {items.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              disabled={tab.disabled}
              className={cn(
                variant === "line" && "px-2 py-4 text-base rounded-none text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=active]:text-primary data-[state=active]:bg-transparent transition-colors shadow-none data-[state=active]:after:bg-primary data-[state=active]:after:opacity-100"
              )}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {items.map((tab) => (
        <TabsContent 
          key={tab.value} 
          value={tab.value}
          className={cn("mt-6 flex-1 focus-visible:outline-none focus-visible:ring-0", contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </UITabs>
  )
}
