"use client";

import { IconCheck, IconSelector } from "@tabler/icons-react";
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
import { type Language } from "@/features/languages/interfaces/language.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";

type LanguageSelectorProps = {
  value: Language | null;
  onChange: (value: Language | null) => void;
  languages: Language[];
  className?: string;
};

export const LanguageSelector = ({
  value,
  onChange,
  languages,
  className,
}: LanguageSelectorProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn("justify-between", className)}
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
              <CommandEmpty>{t("vocabulary.noLanguagesFound")}</CommandEmpty>
              <CommandGroup>
                {languages.map((language, i) => (
                  <CommandItem
                    key={i}
                    value={language.id.toString()}
                    onSelect={() => {
                      onChange(language);
                      setOpen(false);
                    }}
                  >
                    <IconCheck
                      className={
                        value?.id === language.id ? "opacity-100" : "opacity-0"
                      }
                    />
                    <p>{LANGUAGES[language.code]}</p>
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
