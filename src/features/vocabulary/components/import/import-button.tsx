"use client";

import { IconUpload } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";

type ImportButtonProps = {
  className?: string;
  onClick: () => void;
};

export const ImportButton = ({ className, onClick }: ImportButtonProps) => {
  const t = useI18n();

  return (
    <Tooltip content={t("vocabulary.import.title")}>
      <Button className={className} variant="outline" onClick={onClick}>
        <IconUpload className="h-4 w-4" />
        <span>{t("vocabulary.import.button")}</span>
      </Button>
    </Tooltip>
  );
};
