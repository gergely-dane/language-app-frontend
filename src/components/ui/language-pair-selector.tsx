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
import { useLanguagePairs } from "@/features/languages/api/get-language-pairs";
import { useI18n } from "@/hooks/use-i18n";
import { LanguagePair } from "@/interfaces/language-pair.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";
import { IconArrowNarrowRight, IconSelector } from "@tabler/icons-react";
import { useState } from "react";

type LanguagePairSelectorProps = {
  value: LanguagePair | null;
  onChange: (value: LanguagePair | null) => void;
  className?: string;
};

export const LanguagePairSelector = ({
  value,
  onChange,
  className,
}: LanguagePairSelectorProps) => {
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
            className="w-full justify-between gap-1"
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            {value ? (
              <>
                <p>{LANGUAGES[value.sourceLanguageCode]}</p>
                <IconArrowNarrowRight />
                <p>{LANGUAGES[value.translationLanguageCode]}</p>
              </>
            ) : (
              <p>{t("vocabulary.allLanguages")}</p>
            )}

            <IconSelector className="shrink-0 opacity-50" />
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
                  className={cn("gap-1", !value ? "bg-primary" : "")}
                  value="all"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  {t("vocabulary.allLanguages")}
                </CommandItem>

                {languagePairs.map((pair, i) => {
                  const isSelected =
                    value?.sourceLanguageCode === pair.sourceLanguageCode &&
                    value?.translationLanguageCode ===
                      pair.translationLanguageCode;

                  return (
                    <CommandItem
                      className={cn(
                        "gap-1",
                        isSelected
                          ? "bg-primary! text-primary-foreground hover:text-primary-foreground!"
                          : "",
                      )}
                      key={i}
                      value={pair}
                      onSelect={() => {
                        onChange(pair);
                        setOpen(false);
                      }}
                    >
                      <p>{LANGUAGES[pair.sourceLanguageCode]}</p>
                      <IconArrowNarrowRight
                        className={
                          isSelected ? "text-primary-foreground" : "text-black"
                        }
                      />
                      <p>{LANGUAGES[pair.translationLanguageCode]}</p>
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
