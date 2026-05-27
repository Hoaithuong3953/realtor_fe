import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Combobox as UICombobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

export type ComboboxItemType = {
  value: string
  label: string
  icon?: React.ElementType
}

export type ComboboxProps = {
  items: ComboboxItemType[]
  value?: string
  onValueChange?: (value: string | null) => void
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  onSearchChange?: (value: string) => void
  loading?: boolean
}

export const Combobox = ({
  items,
  value,
  onValueChange,
  placeholder,
  emptyText,
  className,
  disabled = false,
  onSearchChange,
  loading = false,
}: ComboboxProps) => {
  const { t } = useTranslation("common")
  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (onSearchChange) {
      const timer = setTimeout(() => {
        onSearchChange(inputValue)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [inputValue, onSearchChange])

  const finalPlaceholder = placeholder ?? t("actions.search")
  const finalEmptyText = emptyText ?? t("actions.no_results")

  const filteredItems = React.useMemo(() => {
    if (onSearchChange) return items
    if (!inputValue) return items
    return items.filter(item =>
      item.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }, [items, inputValue, onSearchChange])

  return (
    <UICombobox
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={finalPlaceholder}
        className={className}
        disabled={disabled}
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
      />
      <ComboboxContent>
        <ComboboxList>
          {filteredItems.map((item) => {
            const Icon = item.icon
            return (
              <ComboboxItem key={item.value} value={item.value}>
                {Icon && <Icon className="mr-2 size-4" />}
                {item.label}
              </ComboboxItem>
            )
          })}
        </ComboboxList>
        {filteredItems.length === 0 && !loading && (
          <div className="w-full justify-center py-4 text-center text-sm text-muted-foreground">
            {finalEmptyText}
          </div>
        )}
        {loading && (
          <div className="w-full justify-center py-4 text-center text-sm text-muted-foreground">
            {t("actions.loading", { defaultValue: "Đang tải..." })}
          </div>
        )}
      </ComboboxContent>
    </UICombobox>
  )
}
