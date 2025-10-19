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
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconCheck, IconSelector } from "@tabler/icons-react";
import { useState } from "react";

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
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="w-30 justify-between"
            variant="outline"
            role="combobox"
            aria-expanded={open}
          >
            <div>{value ? LANGUAGES[value] : "Select language"}</div>
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
                    value={language}
                    onSelect={() => {
                      onChange(language);
                      setOpen(false);
                    }}
                    key={i}
                  >
                    <IconCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        value == language ? "opacity-100" : "opacity-0",
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
