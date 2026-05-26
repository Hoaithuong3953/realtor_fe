import * as React from "react"
import { useFormContext } from "react-hook-form"
import { type ListingFormValues } from "@/schemas/listing.schema"

export function usePropertyMedia() {
  const { watch, setValue, getValues } = useFormContext<ListingFormValues>()
  const [mediaUrlInput, setMediaUrlInput] = React.useState("")

  const mediaList = watch("media") || []

  const addMediaFromUrl = () => {
    if (mediaUrlInput.trim()) {
      const currentMedia = getValues("media") || []
      setValue("media", [...currentMedia, { url: mediaUrlInput.trim() }], { shouldDirty: true })
      setMediaUrlInput("")
    }
  }

  const addMediaFromFiles = (files: FileList | null) => {
    if (files?.length) {
      const currentMedia = getValues("media") || []
      const newMedia = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file
      }))
      setValue("media", [...currentMedia, ...newMedia], { shouldDirty: true })
    }
  }

  const removeMedia = (index: number) => {
    const currentMedia = getValues("media") || []
    const updated = [...currentMedia]
    updated.splice(index, 1)
    setValue("media", updated, { shouldDirty: true })
  }

  return {
    mediaUrlInput,
    setMediaUrlInput,
    mediaList,
    addMediaFromUrl,
    addMediaFromFiles,
    removeMedia
  }
}
