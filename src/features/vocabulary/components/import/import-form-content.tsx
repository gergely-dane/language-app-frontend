"use client";

import { IconUpload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImportDropzone } from "@/features/vocabulary/components/import/import-dropzone";
import { useImportFile } from "@/features/vocabulary/hooks/use-import-file";
import { useI18n } from "@/hooks/use-i18n";

type ImportFormContentProps = {
  onClose: () => void;
};

export const ImportFormContent = ({ onClose }: ImportFormContentProps) => {
  const t = useI18n();
  const { file, setFile, importFile, isPending } = useImportFile(onClose);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("vocabulary.import.title")}</DialogTitle>

        <DialogDescription>
          {t("vocabulary.import.description")}
        </DialogDescription>
      </DialogHeader>

      <ImportDropzone className="h-57" file={file} onChange={setFile} />

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          {t("general.cancel")}
        </Button>

        <Button
          onClick={() => void importFile()}
          isLoading={isPending}
          disabled={!file}
        >
          <IconUpload />
          {t("vocabulary.import.confirm")}
        </Button>
      </DialogFooter>
    </>
  );
};
