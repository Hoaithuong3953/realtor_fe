import { useState, useRef, useEffect, useId } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/atoms"
import { cn } from "@/lib/utils"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"

interface Option {
  value: string
  label: string
}

interface SearchSelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  containerClassName?: string
}

export const SearchSelect = ({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  emptyText = "Không có kết quả",
  className,
  disabled = false,
  label,
  description,
  error,
  required = false,
  containerClassName
}: SearchSelectProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const selectId = `search-select-${useId()}`

  const selectedOption = options.find((opt) => opt.value === value)
  
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const hasMeta = !!label || !!description || !!error

  const renderSelect = () => (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        id={selectId}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          open && "ring-2 ring-ring ring-offset-2",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="sticky top-0 z-10 border-b bg-background p-1">
            <Input
              autoFocus
              prefix={<Search className="h-4 w-4 shrink-0 opacity-50" />}
              className="border-0 shadow-none focus-within:ring-0 focus-within:ring-offset-0 bg-transparent h-9"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    value === option.value && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {value === option.value && <Check className="h-4 w-4" />}
                  </span>
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )

  if (!hasMeta) {
    return renderSelect()
  }

  return (
    <Field
      data-invalid={!!error}
      data-disabled={disabled}
      className={cn(containerClassName)}
    >
      {label ? (
        <FieldLabel htmlFor={selectId}>
          <FieldTitle>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </FieldTitle>
        </FieldLabel>
      ) : null}

      <FieldContent>
        {renderSelect()}
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
    </Field>
  )
}
