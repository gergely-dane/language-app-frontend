"use client";

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
import { LanguagePair, useLanguagePairs } from "@/hooks/languages-hooks";
import { useI18n } from "@/hooks/use-i18n";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  IconArrowNarrowRight,
  IconCheck,
  IconSelector,
} from "@tabler/icons-react";
import { useState } from "react";

interface LanguagePairSelectorProps {
  value: LanguagePair | null;
  onChange: (value: LanguagePair | null) => void;
  className?: string;
}

export function LanguagePairSelector({
  value,
  onChange,
  className,
}: LanguagePairSelectorProps) {
  const [open, setOpen] = useState(false);

  const t = useI18n();

  let { data: languagePairs } = useLanguagePairs();
  if (!languagePairs) {
    languagePairs = [];
  }

  return (
    <div className={className}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="w-full justify-between"
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            {value ? (
              <>
                <div className="">{LANGUAGES[value.sourceLanguageCode]}</div>
                <IconArrowNarrowRight className="mt-1" />
                {LANGUAGES[value.translationLanguageCode]}
              </>
            ) : (
              <p>{t("vocabulary.allLanguages")}</p>
            )}

            <IconSelector className="ml-2 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-fit p-0">
          <Command>
            <CommandInput placeholder={t("vocabulary.searchLanguages")} />

            <CommandList>
              <CommandEmpty>
                {t("vocabulary.noLanguagePairsFound")}
              </CommandEmpty>

              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  <IconCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      !value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {t("vocabulary.allLanguages")}
                </CommandItem>

                {languagePairs.map((pair, i) => (
                  <CommandItem
                    key={i}
                    value={`${pair.sourceLanguageCode}-${pair.translationLanguageCode}`}
                    onSelect={() => {
                      onChange(pair);
                      setOpen(false);
                    }}
                  >
                    <IconCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === pair ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="">{LANGUAGES[pair.sourceLanguageCode]}</div>
                    <IconArrowNarrowRight className="mt-1" />
                    {LANGUAGES[pair.translationLanguageCode]}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
