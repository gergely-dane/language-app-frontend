"use client";

import { IconX } from "@tabler/icons-react";
import { type KeyboardEvent, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 100;

type InlineTagInputProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onEmptyEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  id?: string;
  enterKeyHint?:
    | "done"
    | "enter"
    | "go"
    | "next"
    | "previous"
    | "search"
    | "send";
  autoCapitalize?: string;
  addonEnd?: React.ReactNode;
};

export const InlineTagInput = ({
  tags,
  onTagsChange,
  inputValue,
  onInputValueChange,
  onEmptyEnter,
  placeholder,
  autoFocus = false,
  id,
  enterKeyHint,
  autoCapitalize,
  addonEnd,
}: InlineTagInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const atCapacity = tags.length >= MAX_TAGS;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed) {
        onEmptyEnter?.(e);
        return;
      }

      if (atCapacity) return;

      if (trimmed.includes(",")) {
        const remaining = MAX_TAGS - tags.length;
        const newTags = trimmed
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part && !tags.includes(part))
          .map((part) => part.slice(0, MAX_TAG_LENGTH))
          .slice(0, remaining);

        if (newTags.length) {
          onTagsChange([...tags, ...newTags]);
        }
        onInputValueChange("");
        return;
      }

      const clampedValue = trimmed.slice(0, MAX_TAG_LENGTH);
      if (!tags.includes(clampedValue)) {
        onTagsChange([...tags, clampedValue]);
        onInputValueChange("");
      } else {
        onInputValueChange("");
      }
      return;
    }

    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      e.preventDefault();
      const lastTag = tags[tags.length - 1];
      onTagsChange(tags.slice(0, -1));
      onInputValueChange(lastTag);
    }
  };

  const handleInputChange = (value: string) => {
    if (value.length > MAX_TAG_LENGTH) return;
    onInputValueChange(value);
  };

  const handleRemoveTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    inputRef.current?.focus();
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div
        className={cn(
          "border-input dark:bg-input/30 relative flex min-h-9 w-full min-w-0 cursor-text flex-wrap items-center gap-1.5 rounded-md border px-1.5 py-1 shadow-xs transition-[color,box-shadow] outline-none",
          "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]",
        )}
        onClick={handleContainerClick}
      >
        {tags.map((tag, index) => (
          <Badge
            key={index}
            className="shrink-0 gap-1 py-0.5 pr-1 pl-2 text-base md:text-sm"
          >
            <span className="max-w-32 truncate">{tag}</span>

            <button
              type="button"
              className="hover:bg-primary-foreground/20 flex cursor-pointer items-center rounded-full p-0.5 transition-colors"
              onClick={() => handleRemoveTag(index)}
            >
              <IconX size={12} />
            </button>
          </Badge>
        ))}

        <div className="relative flex min-w-[80px] flex-1 items-center overflow-hidden">
          <input
            ref={inputRef}
            id={id}
            type="text"
            className="placeholder:text-muted-foreground w-full bg-transparent px-1.5 py-1 text-base outline-none md:text-sm"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : undefined}
            autoFocus={autoFocus}
            enterKeyHint={enterKeyHint}
            autoCapitalize={autoCapitalize}
            maxLength={MAX_TAG_LENGTH}
            disabled={atCapacity}
          />
        </div>
      </div>

      {addonEnd}
    </div>
  );
};
