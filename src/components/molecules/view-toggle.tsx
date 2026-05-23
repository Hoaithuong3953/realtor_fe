import { LayoutGrid, List } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export interface ViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
  className?: string
}

export const ViewToggle = ({ view, onViewChange, className }: ViewToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(v) => {
        if (v === "grid" || v === "list") {
          onViewChange(v)
        }
      }}
      className={className}
    >
      <ToggleGroupItem value="grid" aria-label="Grid View">
        <LayoutGrid className="w-4 h-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List View">
        <List className="w-4 h-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
