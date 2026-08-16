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
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguagePairs } from "@/features/languages/api/get-language-pairs";
import { useLanguages } from "@/features/languages/api/get-languages";
import { LANGUAGES } from "@/features/languages/constants";
import { type Language } from "@/features/languages/interfaces/language.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/lib/utils";

type LanguageSelectorProps = {
  value: Language | null;
  onChange: (value: Language | null) => void;
  role: "source" | "target";
  className?: string;
};

export const LanguageSelector = ({
  value,
  onChange,
  role,
  className,
}: LanguageSelectorProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const { data: languages } = useLanguages();
  const { data: languagePairs } = useLanguagePairs();

  const [open, setOpen] = useState(false);

  const { usedLanguages, otherLanguages } = useMemo(() => {
    const counts = new Map<number, number>();
    for (const pair of languagePairs || []) {
      const id =
        role === "source" ? pair.sourceLanguageId : pair.targetLanguageId;
      if (id != null) counts.set(id, (counts.get(id) ?? 0) + pair.count);
    }

    const byName = (a: Language, b: Language) =>
      (LANGUAGES[a.code] || "").localeCompare(LANGUAGES[b.code] || "");

    const used = (languages || [])
      .filter((lang) => counts.has(lang.id))
      .sort((a, b) => counts.get(b.id)! - counts.get(a.id)! || byName(a, b));
    const other = (languages || [])
      .filter((lang) => !counts.has(lang.id))
      .sort(byName);

    return { usedLanguages: used, otherLanguages: other };
  }, [languages, languagePairs, role]);

  const renderLanguageItem = (language: Language) => (
    <CommandItem
      key={language.id}
      value={LANGUAGES[language.code]}
      className={cn(
        value?.id === language.id &&
          "text-primary data-[selected=true]:text-primary",
      )}
      onSelect={() => {
        onChange(language);
        setOpen(false);
      }}
    >
      {LANGUAGES[language.code]}
    </CommandItem>
  );

  return (
    <div>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "font-normal [&>[data-slot=button-content]]:w-full [&>[data-slot=button-content]]:justify-between",
              className,
            )}
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            <p>
              {value
                ? !isMobile
                  ? LANGUAGES[value.code]
                  : value.code.toUpperCase()
                : t("vocabulary.selectLanguage")}
            </p>

            <IconSelector className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-fit p-0"
          onOpenAutoFocus={(e) => isMobile && e.preventDefault()}
        >
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
              <CommandEmpty>{t("vocabulary.noLanguagesFound")}</CommandEmpty>
              {usedLanguages.length > 0 && (
                <CommandGroup
                  heading={t("vocabulary.mostUsed")}
                  className="pb-0 [&_[cmdk-group-heading]]:pb-0 [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:uppercase"
                >
                  {usedLanguages.map(renderLanguageItem)}
                </CommandGroup>
              )}

              {usedLanguages.length > 0 && otherLanguages.length > 0 && (
                <CommandSeparator />
              )}

              <CommandGroup
                heading={
                  usedLanguages.length > 0
                    ? t("vocabulary.allLanguages")
                    : undefined
                }
                className={cn(
                  "[&_[cmdk-group-heading]]:pb-0 [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:uppercase",
                  usedLanguages.length > 0 && "pt-0",
                )}
              >
                {otherLanguages.map(renderLanguageItem)}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
