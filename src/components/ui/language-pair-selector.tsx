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
import { useLanguagePairsSuspense } from "@/features/languages/api/get-language-pairs";
import { useLanguages } from "@/features/languages/api/get-languages";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { type LanguagePair } from "@/interfaces/language-pair.interface";
import { LANGUAGES } from "@/lib/constants";
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

  const { getLanguage } = useLanguages();
  let { data: languagePairs } = useLanguagePairsSuspense();
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
                    ? LANGUAGES[getLanguage(value.sourceLanguageId)?.code || ""]
                    : getLanguage(value.sourceLanguageId)?.code?.toUpperCase()}
                </p>
                <IconArrowNarrowRight />
                <p>
                  {!isMobile
                    ? LANGUAGES[
                        getLanguage(value.translationLanguageId)?.code || ""
                      ]
                    : getLanguage(
                        value.translationLanguageId,
                      )?.code?.toUpperCase()}
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
                  const isSelected =
                    value?.sourceLanguageId === pair.sourceLanguageId &&
                    value?.translationLanguageId === pair.translationLanguageId;

                  return (
                    <CommandItem
                      key={i}
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
                      <p>
                        {
                          LANGUAGES[
                            getLanguage(pair.sourceLanguageId)?.code || ""
                          ]
                        }
                      </p>

                      <IconArrowNarrowRight
                        className={cn(
                          "mt-0.5",
                          isSelected
                            ? "text-primary-foreground"
                            : "text-foreground",
                        )}
                      />

                      <p>
                        {
                          LANGUAGES[
                            getLanguage(pair.translationLanguageId)?.code || ""
                          ]
                        }
                      </p>
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
