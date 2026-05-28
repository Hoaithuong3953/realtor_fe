import React, { useCallback, useState } from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { UploadCloud, File as FileIcon, X, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SUPPORTED_FILE_TYPES, type FileTypeKey } from "@/constants/file"

export interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void
  allowedTypes?: FileTypeKey[]
  maxSize?: number
  disabled?: boolean
  className?: string
}

export const FileDropzone = ({
  onFileSelect,
  allowedTypes = ["excel"],
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  className,
}: FileDropzoneProps) => {
  const { t } = useTranslation("import")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const accept = React.useMemo(() => {
    return allowedTypes.reduce((acc, type) => {
      const mimeTypes = SUPPORTED_FILE_TYPES[type];
      if (mimeTypes) {
        Object.assign(acc, mimeTypes);
      }
      return acc;
    }, {} as Record<string, string[]>);
  }, [allowedTypes])

  const displayExtensions = React.useMemo(() => {
    const exts = new Set<string>();
    allowedTypes.forEach(type => {
      const mimeTypes = SUPPORTED_FILE_TYPES[type];
      if (mimeTypes) {
        (Object.values(mimeTypes) as string[][]).forEach((extArray: string[]) => {
          extArray.forEach((ext: string) => exts.add(ext));
        });
      }
    });
    return Array.from(exts).join(", ");
  }, [allowedTypes])


  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null)
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === "file-invalid-type") {
          setError(t("validation.file_invalid_type"))
        } else if (rejection.errors[0]?.code === "file-too-large") {
          setError(t("validation.file_too_large"))
        } else {
          setError(t("validation.file_upload_error"))
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setSelectedFile(file)
        onFileSelect(file)
      }
    },
    [onFileSelect, t]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled: disabled || selectedFile !== null,
    maxFiles: 1,
  })

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    onFileSelect(null)
    setError(null)
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          selectedFile ? "border-primary bg-primary/5 cursor-default" : "cursor-pointer",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <FileIcon className="w-8 h-8" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                onClick={clearFile}
              >
                <X className="w-4 h-4" />
                <span className="sr-only">{t("dropzone.clear_file")}</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground pointer-events-none">
            <div className="p-3 bg-muted rounded-full">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                <span className="text-primary font-semibold">{t("dropzone.click_to_select")}</span> {t("dropzone.or_drag_here")}
              </p>
              <p className="text-xs">
                {t("dropzone.supported_formats")} {displayExtensions}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
