"use client";

import { IconFileSpreadsheet } from "@tabler/icons-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

import { ALLOWED_IMPORT_EXTENSIONS } from "@/features/vocabulary/constants";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type ImportDropzoneProps = {
  className?: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

export const ImportDropzone = ({
  className,
  file,
  onChange,
}: ImportDropzoneProps) => {
  const t = useI18n();

  const [fileNotAllowed, setFileNotAllowed] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxFiles: 1,
    accept: {
      "application/vnd.ms-excel": [".xls", ".xlsx", ".csv"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxSize: 1024 * 1024,
    onDropRejected: () => {
      setFileNotAllowed(true);
      setTimeout(() => {
        setFileNotAllowed(false);
      }, 3000);
    },
    onDropAccepted(files) {
      onChange(files[0]);
    },
  });

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "mt-2 flex h-57 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-2 border-dashed transition-colors duration-200",
          isDragActive ? "border-primary bg-primary/15" : "",
          fileNotAllowed ? "border-destructive/50 bg-destructive/10" : "",
        )}
      >
        {!file ? (
          <>
            <IconFileSpreadsheet
              className="text-muted-foreground/80 h-12 w-12"
              stroke={1.5}
            />

            <div className="text-muted-foreground mt-2 flex flex-col flex-wrap items-center justify-center">
              <div className="flex">
                <p className="hidden lg:block">
                  {t("vocabulary.dragAndDropOr")}
                </p>

                <label
                  htmlFor="file"
                  className="text-primary hover:text-primary/80 ml-1 cursor-pointer hover:underline hover:underline-offset-4"
                >
                  <p className="capitalize lg:normal-case">
                    {t("vocabulary.chooseFile")}
                  </p>

                  <input
                    {...getInputProps()}
                    id="file-upload-2"
                    name="file-upload-2"
                    type="file"
                  />
                </label>

                <p className="ml-1">{t("vocabulary.toUpload")}</p>
              </div>

              <div
                className={cn(
                  "text-muted-foreground/70 text-center text-sm transition-colors duration-200",
                  fileNotAllowed ? "text-destructive/70" : "",
                )}
              >
                <p>
                  {t("vocabulary.acceptedFormats")}{" "}
                  {ALLOWED_IMPORT_EXTENSIONS.join(", ")}
                </p>

                <p>({t("vocabulary.1mbMaxFileSize")})</p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
            <p className="text-muted-foreground/70">File uploaded:</p>

            <div className="flex gap-1">
              <IconFileSpreadsheet className="text-muted-foreground/80" />
              <p className="font-medium">{file.name}</p>
            </div>

            <p className="text-muted-foreground/80 text-sm">
              {(file.size / 1024).toFixed(2)} KB
            </p>

            <div className="text-muted-foreground absolute bottom-3 flex flex-wrap items-center justify-center">
              <p>{t("vocabulary.dragAndDropOr")}</p>

              <label
                htmlFor="file"
                className="text-primary hover:text-primary/80 ml-1 cursor-pointer hover:underline hover:underline-offset-4"
              >
                <p>{t("vocabulary.browse")}</p>

                <input
                  {...getInputProps()}
                  id="file-upload-2"
                  name="file-upload-2"
                  type="file"
                />
              </label>

              <p className="ml-1">{t("vocabulary.toReplaceFile")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
