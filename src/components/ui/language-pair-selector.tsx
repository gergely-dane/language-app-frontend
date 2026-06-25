"use client";

import { IconArrowNarrowRight, IconSelector } from "@tabler/icons-react";
import { useState } from "react";

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
import { type LanguagePair } from "@/features/languages/interfaces/language-pair.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";

type LanguagePairSelectorProps = {
  className?: string;
  value: LanguagePair | null;
  onChange: (value: LanguagePair | null) => void;
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
  let { data: languagePairs } = useLanguagePairs();
  if (!languagePairs) {
    languagePairs = [];
  }

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
            {value ? (
              <>
                <p>
                  {!isMobile
                    ? getLanguageString(value.sourceLanguageId)
                    : getLanguageCode(value.sourceLanguageId).toUpperCase()}
                </p>
                <IconArrowNarrowRight className="mt-0.5" />
                <p>
                  {!isMobile
                    ? getLanguageString(value.translationLanguageId)
                    : getLanguageCode(
                        value.translationLanguageId,
                      ).toUpperCase()}
                </p>
              </>
            ) : (
              <p>
                {!isMobile ? t("vocabulary.allLanguages") : t("vocabulary.all")}
              </p>
            )}

            <IconSelector className="shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-fit p-0">
          <Command>
            <CommandInput
              className="w-20 lg:w-30"
              placeholder={
                !isMobile
                  ? t("vocabulary.searchLanguages")
                  : t("general.search")
              }
            />

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
                  const sourceLanguage = getLanguageString(
                    pair.sourceLanguageId,
                  );
                  const translationLanguage = getLanguageString(
                    pair.translationLanguageId,
                  );

                  const isSelected =
                    value?.sourceLanguageId === pair.sourceLanguageId &&
                    value?.translationLanguageId === pair.translationLanguageId;

                  return (
                    <CommandItem
                      key={i}
                      value={`${sourceLanguage} ${translationLanguage}`}
                      className={cn(
                        "gap-1",
                        isSelected
                          ? "bg-primary! text-primary-foreground hover:text-primary-foreground!"
                          : "",
                      )}
                      onSelect={() => {
                        onChange(pair);
                        setOpen(false);
                      }}
                    >
                      <p>{sourceLanguage}</p>

                      <IconArrowNarrowRight
                        className={cn(
                          "mt-0.5",
                          isSelected
                            ? "text-primary-foreground"
                            : "text-foreground",
                        )}
                      />

                      <p>{translationLanguage}</p>
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
