export interface RangeFilterProps {
  minValue: string | number
  maxValue: string | number
  onMinChange: (val: string) => void
  onMaxChange: (val: string) => void
  minPlaceholder?: string
  maxPlaceholder?: string
  className?: string
}

export const RangeFilter = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder,
  maxPlaceholder,
  className
}: RangeFilterProps) => {
  return (
    <div className={`flex items-center gap-2 bg-background border rounded-md px-3 h-10 flex-1 w-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all ${className || ""}`}>
      <input 
        type="number" 
        placeholder={minPlaceholder} 
        value={minValue || ""} 
        onChange={(e) => onMinChange(e.target.value)} 
        className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
      />
      <span className="text-muted-foreground">-</span>
      <input 
        type="number" 
        placeholder={maxPlaceholder} 
        value={maxValue || ""} 
        onChange={(e) => onMaxChange(e.target.value)} 
        className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground text-right"
      />
    </div>
  )
}
