import { useTranslation } from "react-i18next"
import { Trash2 } from "lucide-react"
import { Input, Button } from "@/components/atoms"

import { usePropertyMedia } from "@/hooks/listings/use-property-media"

export const MediaStep = () => {
  const { t } = useTranslation(["listing", "common"])
  
  const {
    mediaUrlInput,
    setMediaUrlInput,
    mediaList,
    addMediaFromUrl,
    addMediaFromFiles,
    removeMedia
  } = usePropertyMedia()

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input 
            value={mediaUrlInput}
            onChange={e => setMediaUrlInput(e.target.value)}
            placeholder={t("form.media_url_placeholder")}
          />
        </div>
        <Button type="button" variant="secondary" onClick={addMediaFromUrl}>
          {t("form.add_from_web_btn")}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="h-px bg-border flex-1" />
        <span className="text-muted-foreground text-sm uppercase">{t("form.media_or")}</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="relative">
        <Button type="button" variant="outline" className="w-full relative overflow-hidden">
          {t("form.upload_from_device_btn")}
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => addMediaFromFiles(e.target.files)}
          />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {mediaList.map((m, idx) => (
          <div key={idx} className="relative group rounded-md border overflow-hidden aspect-video bg-muted">
            <img src={m.url as string} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeMedia(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
