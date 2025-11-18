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
import {
  IconArrowNarrowRight,
  IconCheck,
  IconSelector,
} from "@tabler/icons-react";
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
                  <IconCheck className={!value ? "opacity-100" : "opacity-0"} />
                  {t("vocabulary.allLanguages")}
                </CommandItem>

                {languagePairs.map((pair, i) => (
                  <CommandItem
                    key={i}
                    value={pair}
                    onSelect={() => {
                      onChange(pair);
                      setOpen(false);
                    }}
                  >
                    <IconCheck
                      className={
                        value?.sourceLanguageCode === pair.sourceLanguageCode &&
                        value?.translationLanguageCode ===
                          pair.translationLanguageCode
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    />

                    <p>{LANGUAGES[pair.sourceLanguageCode]}</p>

                    <IconArrowNarrowRight className="mt-1" />

                    <p>{LANGUAGES[pair.translationLanguageCode]}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
