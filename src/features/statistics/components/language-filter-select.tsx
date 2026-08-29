"use client";

import { IconSelector } from "@tabler/icons-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguagePairs } from "@/features/languages/api/get-language-pairs";
import { useLanguages } from "@/features/languages/api/get-languages";
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

  const sourceLanguages = useMemo(() => {
    const counts = new Map<number, number>();
    for (const pair of languagePairs) {
      if (pair.sourceLanguageId == null) continue;
      counts.set(
        pair.sourceLanguageId,
        (counts.get(pair.sourceLanguageId) ?? 0) + pair.count,
      );
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [languagePairs]);

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
          <Command>
            <CommandInput placeholder={t("general.search")} />
            <CommandList>
              <CommandEmpty>{t("vocabulary.noLanguagesFound")}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all-languages"
                  className={cn(
                    "gap-1",
                    value == null &&
                      "text-primary data-[selected=true]:text-primary",
                  )}
                  onSelect={() => handleSelect(null)}
                >
                  {t("statistics.languageFilter.all")}
                </CommandItem>

                {sourceLanguages.map(([id, count]) => {
                  const label = getLanguageString(id);
                  const isSelected = value === id;

                  return (
                    <CommandItem
                      key={id}
                      value={label}
                      className={cn(
                        "justify-between gap-1",
                        isSelected &&
                          "text-primary data-[selected=true]:text-primary",
                      )}
                      onSelect={() => handleSelect(id)}
                    >
                      <span className="truncate">{label}</span>

                      <span className="text-muted-foreground font-mono text-[11px]">
                        {count}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
