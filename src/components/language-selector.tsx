"use client";

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
import { cn } from "@/lib/utils";
import { IconCheck, IconSelector } from "@tabler/icons-react";
import { LANGUAGES } from "@/lib/constants";
import LanguageFlag from "@/components/language-flag";

interface LanguageSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  languages: string[];
  className?: string;
}

export function LanguageSelector({
  value,
  onChange,
  languages,
  className,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <LanguageFlag language={value} />
            <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <Command>
            <CommandInput placeholder="Search languages..." />
            <CommandList>
              <CommandEmpty>No languages found.</CommandEmpty>
              <CommandGroup>
                {languages.map((language, i) => (
                  <CommandItem
                    key={i}
                    value={language}
                    onSelect={() => {
                      onChange(language);
                      setOpen(false);
                    }}
                  >
                    <IconCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        value == language ? "opacity-100" : "opacity-0",
                        "text:[var(--text-color)]",
                      )}
                    />
                    <div>{LANGUAGES[language]}</div>
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
