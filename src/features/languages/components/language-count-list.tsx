"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLanguages } from "@/features/languages/api/get-languages";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type LanguageCountListProps = {
  className?: string;
  heading: string;
  countLabel: string;
  anyLabel: string;
  anyValue: string;
  languageCounts: [number | null, number][];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
};

export const LanguageCountList = ({
  className,
  heading,
  countLabel,
  anyLabel,
  anyValue,
  languageCounts,
  selectedId,
  onSelect,
}: LanguageCountListProps) => {
  const t = useI18n();
  const { getLanguageString } = useLanguages();

  return (
    <Command className={className}>
      <CommandInput placeholder={t("general.search")} />
      <CommandList>
        <CommandEmpty>{t("vocabulary.noLanguagesFound")}</CommandEmpty>
        <CommandGroup
          heading={
            <span className="flex justify-between gap-2">
              <span>{heading}</span>

              <span>{countLabel}</span>
            </span>
          }
          className="[&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:uppercase"
        >
          <CommandItem
            value={anyValue}
            className={cn(
              "gap-1",
              selectedId == null &&
                "text-primary data-[selected=true]:text-primary",
            )}
            onSelect={() => onSelect(null)}
          >
            {anyLabel}
          </CommandItem>

          {languageCounts.map(([id, count]) => {
            const label = getLanguageString(id);

            return (
              <CommandItem
                key={String(id)}
                value={label}
                className={cn(
                  "justify-between gap-1",
                  selectedId === id &&
                    "text-primary data-[selected=true]:text-primary",
                )}
                onSelect={() => onSelect(id)}
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
  );
};
