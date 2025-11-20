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
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";
import { IconCheck, IconSelector } from "@tabler/icons-react";
import { useState } from "react";

type LanguageSelectorProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  languages: string[];
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
                  ? LANGUAGES[value]
                  : value.toUpperCase()
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
                    value={LANGUAGES[language]}
                    onSelect={() => {
                      onChange(language);
                      setOpen(false);
                    }}
                  >
                    <IconCheck
                      className={
                        value == language ? "opacity-100" : "opacity-0"
                      }
                    />
                    <p>{LANGUAGES[language]}</p>
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
