"use client";

import { useI18n } from "@/hooks/use-i18n";
import { ALLOWED_IMPORT_EXTENSIONS } from "@/lib/constants";
import { cn } from "@/utils/cn";
import { IconFileSpreadsheet } from "@tabler/icons-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

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
          "mt-2 flex flex-col items-center justify-center rounded-md border border-2 border-dashed w-full h-57 transition-colors duration-200 cursor-pointer",
          isDragActive ? "border-primary bg-primary/15" : "",
          fileNotAllowed ? "border-destructive/50 bg-destructive/10" : "",
        )}
      >
        {!file ? (
          <>
            <IconFileSpreadsheet
              className="h-12 w-12 text-muted-foreground/80"
              stroke={1.5}
            />

            <div className="mt-2 flex flex-col flex-wrap items-center justify-center text-muted-foreground">
              <div className="flex">
                <p className="hidden lg:block">
                  {t("vocabulary.dragAndDropOr")}
                </p>

                <label
                  htmlFor="file"
                  className="cursor-pointer ml-1 text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
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
                  "text-center text-sm text-muted-foreground/70 transition-colors duration-200",
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
          <div className="relative flex flex-col items-center justify-center w-full h-full text-center">
            <p className="text-muted-foreground/70">File uploaded:</p>

            <div className="flex gap-1">
              <IconFileSpreadsheet className="text-muted-foreground/80" />
              <p className="font-medium">{file.name}</p>
            </div>

            <p className="text-sm text-muted-foreground/80">
              {(file.size / 1024).toFixed(2)} KB
            </p>

            <div className="absolute bottom-3 flex flex-wrap items-center justify-center text-muted-foreground">
              <p>{t("vocabulary.dragAndDropOr")}</p>

              <label
                htmlFor="file"
                className="cursor-pointer ml-1 text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
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
