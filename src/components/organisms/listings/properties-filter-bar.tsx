import { X } from "lucide-react"
import { SortDropdown, ViewToggle, SearchFilter, DropdownFilter, RangeFilter, CurrencyRangeFilter } from "@/components/molecules"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/atoms"

export interface FilterOption {
  label: string
  value: string
}

export interface PropertiesFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  filters: Record<string, string | undefined>
  onFilterChange: (key: string, val: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (val: "grid" | "list") => void
  sortValue?: string
  onSortChange?: (val: string) => void
  statusOptions: FilterOption[]
  listingTypeOptions: FilterOption[]
  propertyTypeOptions: FilterOption[]
  sortOptions?: FilterOption[]
  onClearFilters: () => void
}

export const PropertiesFilterBar = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  statusOptions,
  listingTypeOptions,
  propertyTypeOptions,
  sortOptions,
  viewMode,
  onViewModeChange,
  sortValue,
  onSortChange,
  onClearFilters,
}: PropertiesFilterBarProps) => {
  const { t } = useTranslation("listing")

  const safeFilters = filters || {}
  const hasActiveFilters = search !== "" || Object.values(safeFilters).some(val => val !== "" && val !== undefined)

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border shadow-sm w-full">
      {/* Search and Top actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
        <div className="flex-1 w-full">
          <SearchFilter 
            placeholder={t("list.filter_search")} 
            value={search}
            onChange={onSearchChange}
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
              {t("list.action_clear_filter")}
            </Button>
          )}
          {sortOptions && sortOptions.length > 0 && sortValue && onSortChange && (
            <SortDropdown 
              options={sortOptions}
              value={sortValue}
              onChange={onSortChange}
              placeholder={t("common:sort.title")}
            />
          )}
          <ViewToggle view={viewMode} onViewChange={onViewModeChange} />
        </div>
      </div>

      {/* Select Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full pt-4 border-t">
        <DropdownFilter 
          value={safeFilters.listingType || ""}
          onChange={(val) => onFilterChange("listingType", val)}
          placeholder={t("list.filter_all_type")}
          options={listingTypeOptions}
        />
        <DropdownFilter 
          value={safeFilters.propertyType || ""}
          onChange={(val) => onFilterChange("propertyType", val)}
          placeholder={t("list.filter_all_properties")}
          options={propertyTypeOptions}
        />
        <DropdownFilter 
          value={safeFilters.status || ""}
          onChange={(val) => onFilterChange("status", val)}
          placeholder={t("list.filter_all_status")}
          options={statusOptions}
        />
      </div>
        
      {/* Advanced Range Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
        {/* Price Range */}
        <CurrencyRangeFilter 
          minValue={safeFilters.minPrice || ""}
          maxValue={safeFilters.maxPrice || ""}
          onMinChange={(val) => onFilterChange("minPrice", val)}
          onMaxChange={(val) => onFilterChange("maxPrice", val)}
          minPlaceholder={t("list.filter_min_price")}
          maxPlaceholder={t("list.filter_max_price")}
        />

        {/* Area Range */}
        <RangeFilter 
          minValue={safeFilters.minArea || ""}
          maxValue={safeFilters.maxArea || ""}
          onMinChange={(val) => onFilterChange("minArea", val)}
          onMaxChange={(val) => onFilterChange("maxArea", val)}
          minPlaceholder={t("list.filter_min_area")}
          maxPlaceholder={t("list.filter_max_area")}
        />
      </div>
    </div>
  )
}
