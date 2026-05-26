import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tag } from "@/components/atoms/tag"
import { cn } from "@/lib/utils"

export const listingBadgeVariants = cva(
  "border-transparent font-normal shadow-none",
  {
    variants: {
      listing: {
        active: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
        draft: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
        inactive: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20",
        sale: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/20",
        rent: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
      },
    },
  }
)

export interface ListingBadgeProps
  extends React.ComponentProps<typeof Tag>,
    VariantProps<typeof listingBadgeVariants> {}

export const ListingBadge = ({ className, listing, ...props }: ListingBadgeProps) => {
  return (
    <Tag
      className={cn(listingBadgeVariants({ listing }), className)}
      {...props}
    />
  )
}
