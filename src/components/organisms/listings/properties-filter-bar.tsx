import { Search, X } from "lucide-react"
import { Input } from "@/components/ui"
import { Select } from "@/components/molecules"
import { ViewToggle } from "@/components/molecules"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/atoms"

export interface FilterOption {
  label: string
  value: string
}

export interface PropertiesFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  status: string
  onStatusChange: (val: string) => void
  listingType: string
  onTypeChange: (val: string) => void
  propertyType: string
  onPropertyTypeChange: (val: string) => void
  minPrice: string
  onMinPriceChange: (val: string) => void
  maxPrice: string
  onMaxPriceChange: (val: string) => void
  minArea: string
  onMinAreaChange: (val: string) => void
  maxArea: string
  onMaxAreaChange: (val: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (val: "grid" | "list") => void
  statusOptions: FilterOption[]
  listingTypeOptions: FilterOption[]
  propertyTypeOptions: FilterOption[]
  onClearFilters: () => void
}

export const PropertiesFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  listingType,
  onTypeChange,
  propertyType,
  onPropertyTypeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  minArea,
  onMinAreaChange,
  maxArea,
  onMaxAreaChange,
  statusOptions,
  listingTypeOptions,
  propertyTypeOptions,
  viewMode,
  onViewModeChange,
  onClearFilters,
}: PropertiesFilterBarProps) => {
  const { t } = useTranslation("listing")

  const hasActiveFilters = search !== "" || status !== "" || listingType !== "" || propertyType !== "" || minPrice !== "" || maxPrice !== "" || minArea !== "" || maxArea !== ""

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border shadow-sm w-full">
      {/* Search and Top actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={t("filter.search")} 
            className="pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              {t("action.clear_filter")}
            </Button>
          )}
          <ViewToggle view={viewMode} onViewChange={onViewModeChange} />
        </div>
      </div>

      {/* Select Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full pt-4 border-t">
        <Select 
          className="flex-1 w-full"
          value={listingType || "all"}
          onChange={(val) => onTypeChange(val === "all" ? "" : val)}
          placeholder={t("filter.all_type")}
          options={listingTypeOptions}
        />
        <Select 
          className="flex-1 w-full"
          value={propertyType || "all"}
          onChange={(val) => onPropertyTypeChange(val === "all" ? "" : val)}
          placeholder={t("filter.all_properties", "Tất cả bất động sản")}
          options={propertyTypeOptions}
        />
        <Select 
          className="flex-1 w-full"
          value={status || "all"}
          onChange={(val) => onStatusChange(val === "all" ? "" : val)}
          placeholder={t("filter.all_status")}
          options={statusOptions}
        />
      </div>
        
      {/* Advanced Range Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
        {/* Price Range */}
        <div className="flex items-center gap-2 bg-background border rounded-md px-3 h-10 flex-1 w-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
          <input 
            type="number" 
            placeholder={t("filter.min_price")} 
            value={minPrice} 
            onChange={(e) => onMinPriceChange(e.target.value)} 
            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
          />
          <span className="text-muted-foreground">-</span>
          <input 
            type="number" 
            placeholder={t("filter.max_price")} 
            value={maxPrice} 
            onChange={(e) => onMaxPriceChange(e.target.value)} 
            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground text-right"
          />
        </div>

        {/* Area Range */}
        <div className="flex items-center gap-2 bg-background border rounded-md px-3 h-10 flex-1 w-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
          <input 
            type="number" 
            placeholder={t("filter.min_area")} 
            value={minArea} 
            onChange={(e) => onMinAreaChange(e.target.value)} 
            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
          />
          <span className="text-muted-foreground">-</span>
          <input 
            type="number" 
            placeholder={t("filter.max_area")} 
            value={maxArea} 
            onChange={(e) => onMaxAreaChange(e.target.value)} 
            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground text-right"
          />
        </div>
      </div>
    </div>
  )
}
