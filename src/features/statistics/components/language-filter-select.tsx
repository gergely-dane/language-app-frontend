"use client";

import { IconSelector } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguagePairs } from "@/features/languages/api/get-language-pairs";
import { useLanguages } from "@/features/languages/api/get-languages";
import { LanguageCountList } from "@/features/languages/components/language-count-list";
import { getLanguageOptions } from "@/features/languages/utils";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type LanguageFilterSelectProps = {
  className?: string;
  value: number | null;
  onChange: (value: number | null) => void;
};

export const LanguageFilterSelect = ({
  className,
  value,
  onChange,
}: LanguageFilterSelectProps) => {
  const [open, setOpen] = useState(false);

  const t = useI18n();

  const { getLanguageString, isLoading: isLanguagesLoading } = useLanguages();
  const { data: languagePairs = [], isLoading: isLanguagePairsLoading } =
    useLanguagePairs();

  const sourceLanguages = useMemo(
    () =>
      getLanguageOptions(languagePairs, "source", null).filter(
        ([id]) => id != null,
      ),
    [languagePairs],
  );

  const handleSelect = (id: number | null) => {
    onChange(id);
    setOpen(false);
  };

  if (isLanguagesLoading || isLanguagePairsLoading) {
    return (
      <Skeleton className={cn("h-9 min-h-9 min-w-36 rounded-md", className)} />
    );
  }

  return (
    <div className={className}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="w-full justify-between gap-1 font-normal [&>[data-slot=button-content]]:w-full [&>[data-slot=button-content]]:justify-between"
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            <p className="truncate">
              {value != null
                ? getLanguageString(value)
                : t("statistics.languageFilter.all")}
            </p>

            <IconSelector className="shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-52 p-0" align="end">
          <LanguageCountList
            heading={t("statistics.languageFilter.language")}
            countLabel={t("vocabulary.words")}
            anyLabel={t("statistics.languageFilter.all")}
            anyValue="all-languages"
            languageCounts={sourceLanguages}
            selectedId={value}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
