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
import {
  IconArrowNarrowRight,
  IconCheck,
  IconSelector,
} from "@tabler/icons-react";
import { LANGUAGES } from "@/lib/constants";
import { LanguagePair } from "@/app/vocabulary/columns";

interface LanguagePairSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  languagePairs: string[];
  className?: string;
}

export function LanguagePairSelector({
  value,
  onChange,
  languagePairs,
  className,
}: LanguagePairSelectorProps) {
  const [open, setOpen] = useState(false);
  const pairs: LanguagePair = languagePairs.map((pair) => {
    const [sourceLanguage, translationLanguage] = pair.split("-");
    return {
      sourceLanguage,
      translationLanguage,
    };
  });
  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? (
              <>
                {LANGUAGES[value.split("-")[0]]}
                <IconArrowNarrowRight className="mt-1" />
                {LANGUAGES[value.split("-")[1]]}
              </>
            ) : (
              "All language pairs"
            )}
            <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <Command>
            <CommandInput placeholder="Search languages..." />
            <CommandList>
              <CommandEmpty>No language pairs found.</CommandEmpty>
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
                      "text:[var(--text-color)]",
                    )}
                  />
                  All language pairs
                </CommandItem>
                {pairs.map((pair, i) => (
                  <CommandItem
                    key={i}
                    value={`${pair.sourceLanguage}-${pair.translationLanguage}`}
                    onSelect={() => {
                      onChange(
                        `${pair.sourceLanguage}-${pair.translationLanguage}`,
                      );
                      setOpen(false);
                    }}
                  >
                    <IconCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        value ==
                          `${pair.sourceLanguage}-${pair.translationLanguage}`
                          ? "opacity-100"
                          : "opacity-0",
                        "text:[var(--text-color)]",
                      )}
                    />
                    <div className="">{LANGUAGES[pair.sourceLanguage]}</div>
                    <IconArrowNarrowRight className="mt-1 text:[var(--text-color)]" />
                    {LANGUAGES[pair.translationLanguage]}
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
