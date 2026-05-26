import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ListingFormValues } from "@/schemas/listing.schema"

interface ListingDraftState {
  draft: Partial<ListingFormValues> | null
  setDraft: (draft: Partial<ListingFormValues>) => void
  clearDraft: () => void
}

export const useListingDraftStore = create<ListingDraftState>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null })
    }),
    {
      name: "listing-draft-storage"
    }
  )
)
