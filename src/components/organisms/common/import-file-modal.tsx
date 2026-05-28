import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/atoms";
import { FileDropzone } from "@/components/molecules/file-dropzone";
import { Progress } from "@/components/ui";
import { type FileTypeKey } from "@/constants/file";

export interface ImportFileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  allowedTypes?: FileTypeKey[];
  templateUrl?: string;
  isLoading?: boolean;
  progress?: number;
  onImport: (file: File) => void;
}

export const ImportFileModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  allowedTypes,
  templateUrl,
  isLoading = false,
  progress,
  onImport,
}: ImportFileModalProps) => {
  const { t } = useTranslation("import");
  const displayDescription = description ?? t("importFile.defaultDescription");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedFile(null);
      onOpenChange(false);
    }
  };

  // Reset file state if modal opens fresh
  React.useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <FileDropzone
            onFileSelect={setSelectedFile}
            allowedTypes={allowedTypes}
            disabled={isLoading}
          />

          {isLoading && progress !== undefined && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("importFile.processing")}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {templateUrl && (
            <div className="text-center text-sm">
              {t("importFile.noTemplate")}{" "}
              <a
                href={templateUrl}
                download
                className="font-medium text-primary hover:underline"
              >
                {t("importFile.downloadTemplate")}
              </a>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
          {t("common:actions.cancel")}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile}
            isLoading={isLoading}
            loadingText={t("importFile.processing")}
          >
            {t("importFile.importBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
