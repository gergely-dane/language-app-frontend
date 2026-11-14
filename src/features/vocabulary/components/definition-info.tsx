"use client";

import { IconInfoCircle } from "@tabler/icons-react";

import { Tooltip } from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type DefinitionInfoProps = {
  definition: string;
  className?: string;
  iconClassName?: string;
};

export const DefinitionInfo = ({
  definition,
  className,
  iconClassName,
}: DefinitionInfoProps) => {
  const t = useI18n();

  return (
    <Tooltip
      content={
        <>
          <p className="font-medium">{t("vocabulary.definition")}</p>

          <p className="text-muted-foreground whitespace-pre-line">
            {definition}
          </p>
        </>
      }
      className="grid gap-1.5 text-left text-wrap"
    >
      <span
        role="img"
        tabIndex={0}
        aria-label={t("vocabulary.definition")}
        className={cn(
          "focus-visible:ring-ring/50 inline-flex size-7 shrink-0 cursor-help items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-[3px]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <IconInfoCircle className={cn("size-4.5", iconClassName)} />
      </span>
    </Tooltip>
  );
};
