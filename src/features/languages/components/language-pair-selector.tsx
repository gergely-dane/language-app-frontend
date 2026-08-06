"use client";

import { IconArrowNarrowRight, IconSelector } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguagePairs } from "@/features/languages/api/get-language-pairs";
import { useLanguages } from "@/features/languages/api/get-languages";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/lib/utils";

export type LanguageFilterValue = {
  sourceLanguageId: number | null;
  targetLanguageId: number | null;
};

type LanguagePairSelectorProps = {
  className?: string;
  value: LanguageFilterValue | null;
  onChange: (value: LanguageFilterValue) => void;
  disabled?: boolean;
};

export const LanguagePairSelector = ({
  className,
  value,
  onChange,
  disabled = false,
}: LanguagePairSelectorProps) => {
  const [open, setOpen] = useState(false);

  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const { getLanguageString, getLanguageCode } = useLanguages();
  const { data: languagePairs = [] } = useLanguagePairs();

  const currentSourceId = value?.sourceLanguageId || null;
  const currentTargetId = value?.targetLanguageId || null;

  const sourceLanguages = useMemo(() => {
    const filtered = currentTargetId
      ? languagePairs.filter((p) => p.targetLanguageId === currentTargetId)
      : languagePairs;
    return Array.from(new Set(filtered.map((p) => p.sourceLanguageId)));
  }, [languagePairs, currentTargetId]);

  const translationLanguages = useMemo(() => {
    const filtered = currentSourceId
      ? languagePairs.filter((p) => p.sourceLanguageId === currentSourceId)
      : languagePairs;
    return Array.from(new Set(filtered.map((p) => p.targetLanguageId)));
  }, [languagePairs, currentSourceId]);

  const handleSelect = (type: "source" | "translation", id: number | null) => {
    onChange({
      sourceLanguageId: type === "source" ? id : currentSourceId,
      targetLanguageId: type === "translation" ? id : currentTargetId,
    });
  };

  return (
    <div className={className}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            className="w-full justify-between gap-1"
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            <div className="flex items-center gap-2 truncate">
              <p className="truncate">
                {currentSourceId
                  ? !isMobile
                    ? getLanguageString(currentSourceId)
                    : getLanguageCode(currentSourceId).toUpperCase()
                  : t("vocabulary.any")}
              </p>

              <IconArrowNarrowRight className="mt-0.5 shrink-0" />

              <p className="truncate">
                {currentTargetId
                  ? !isMobile
                    ? getLanguageString(currentTargetId)
                    : getLanguageCode(currentTargetId).toUpperCase()
                  : t("vocabulary.any")}
              </p>
            </div>

            <IconSelector className="shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[300px] p-0"
          align="start"
          onOpenAutoFocus={(e) => isMobile && e.preventDefault()}
        >
          <div className="flex flex-row divide-x">
            <Command className="flex-1 rounded-r-none">
              <CommandInput placeholder={t("general.search")} />
              <CommandList>
                <CommandEmpty>{t("vocabulary.noLanguagesFound")}</CommandEmpty>
                <CommandGroup heading={t("general.sourceLanguage")}>
                  <CommandItem
                    value="any-source"
                    className={cn(
                      "gap-1",
                      !currentSourceId
                        ? "bg-primary! text-primary-foreground hover:text-primary-foreground!"
                        : "",
                    )}
                    onSelect={() => handleSelect("source", null)}
                  >
                    {t("vocabulary.any")}
                  </CommandItem>

                  {sourceLanguages.map((id) => {
                    const label = getLanguageString(id);
                    const isSelected = currentSourceId === id;

                    return (
                      <CommandItem
                        key={`source-${id}`}
                        value={label}
                        className={cn(
                          "gap-1",
                          isSelected
                            ? "bg-primary! text-primary-foreground hover:text-primary-foreground!"
                            : "",
                        )}
                        onSelect={() => handleSelect("source", id)}
                      >
                        {label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>

            <Command className="flex-1">
              <CommandInput placeholder={t("general.search")} />
              <CommandList>
                <CommandEmpty>{t("vocabulary.noLanguagesFound")}</CommandEmpty>
                <CommandGroup heading={t("general.targetLanguage")}>
                  <CommandItem
                    value="any-translation"
                    className={cn(
                      "gap-1",
                      !currentTargetId
                        ? "bg-primary! text-primary-foreground hover:text-primary-foreground!"
                        : "",
                    )}
                    onSelect={() => handleSelect("translation", null)}
                  >
                    {t("vocabulary.any")}
                  </CommandItem>

                  {translationLanguages.map((id) => {
                    const label = getLanguageString(id);
                    const isSelected = currentTargetId === id;

                    return (
                      <CommandItem
                        key={`translation-${id}`}
                        value={label}
                        className={cn(
                          "gap-1",
                          isSelected
                            ? "bg-primary! text-primary-foreground hover:text-primary-foreground!"
                            : "",
                        )}
                        onSelect={() => handleSelect("translation", id)}
                      >
                        {label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
