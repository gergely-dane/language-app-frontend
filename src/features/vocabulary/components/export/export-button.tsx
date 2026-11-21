"use client";

import { IconDownload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type ExportButtonProps = {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
};

export const ExportButton = ({
  className,
  onClick,
  disabled = false,
}: ExportButtonProps) => {
  const t = useI18n();

  return (
    <Tooltip content={t("vocabulary.export.title")}>
      <Button
        className={cn("max-lg:w-9 max-lg:px-0", className)}
        variant="outline"
        onClick={onClick}
        disabled={disabled}
      >
        <IconDownload className="h-4 w-4" />
        <span className="max-lg:sr-only">{t("vocabulary.export.button")}</span>
      </Button>
    </Tooltip>
  );
};
