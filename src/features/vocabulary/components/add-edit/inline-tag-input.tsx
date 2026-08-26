"use client";

import {
  type ClipboardEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";

import { EditableTag } from "@/features/vocabulary/components/add-edit/editable-tag";
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/features/vocabulary/constants";
import {
  moveTag,
  parseTagInput,
  replaceTagAt,
} from "@/features/vocabulary/utils";
import { cn } from "@/lib/utils";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const atCapacity = tags.length >= MAX_TAGS;

  const focusTagAt = (index: number) => {
    const buttons =
      containerRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-tag-button]",
      );
    buttons?.[index]?.focus();
  };

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

      onTagsChange(parseTagInput(trimmed, tags));
      onInputValueChange("");
      return;
    }

    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      e.preventDefault();
      const lastTag = tags[tags.length - 1];
      onTagsChange(tags.slice(0, -1));
      onInputValueChange(lastTag);
      return;
    }

    if (e.key === "ArrowLeft" && tags.length > 0) {
      const input = e.currentTarget;
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        e.preventDefault();
        focusTagAt(tags.length - 1);
      }
    }
  };

  const handleInputChange = (value: string) => {
    if (value.includes(",")) {
      const lastCommaIndex = value.lastIndexOf(",");
      const next = parseTagInput(value.slice(0, lastCommaIndex), tags);
      onTagsChange(next);

      const remainder =
        next.length >= MAX_TAGS
          ? ""
          : value
              .slice(lastCommaIndex + 1)
              .trimStart()
              .slice(0, MAX_TAG_LENGTH);
      onInputValueChange(remainder);
      return;
    }

    onInputValueChange(value.slice(0, MAX_TAG_LENGTH));
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!/[\n\r,]/.test(text) || atCapacity) return;

    e.preventDefault();
    const combined = `${inputValue},${text.replace(/[\n\r]+/g, ",")}`;
    onTagsChange(parseTagInput(combined, tags));
    onInputValueChange("");
  };

  const handleRemoveTag = (index: number) => {
    if (editingIndex !== null) {
      if (index < editingIndex) setEditingIndex(editingIndex - 1);
      else if (index === editingIndex) setEditingIndex(null);
    }

    onTagsChange(tags.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleReorder = (from: number, to: number) => {
    if (from === to || to < 0 || to >= tags.length) return;
    onTagsChange(moveTag(tags, from, to));
  };

  const handleCommitEdit = (index: number, value: string) => {
    setEditingIndex(null);
    onTagsChange(replaceTagAt(tags, index, value));
    inputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    inputRef.current?.focus();
  };

  const handleNavigate = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0) return;

    if (target >= tags.length) {
      inputRef.current?.focus();
      return;
    }

    focusTagAt(target);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, input")) {
      return;
    }
    inputRef.current?.focus();
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div
        ref={containerRef}
        className={cn(
          "border-input dark:bg-input/30 relative flex min-h-9 w-full min-w-0 cursor-text flex-wrap items-center gap-1.5 rounded-md border px-1.5 py-1 shadow-xs transition-[color,box-shadow] outline-none",
          "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]",
        )}
        onClick={handleContainerClick}
      >
        {tags.map((tag, index) => (
          <EditableTag
            key={tag}
            tag={tag}
            index={index}
            isEditing={editingIndex === index}
            onStartEdit={setEditingIndex}
            onCommitEdit={handleCommitEdit}
            onCancelEdit={handleCancelEdit}
            onRemove={handleRemoveTag}
            onReorder={handleReorder}
            onNavigate={handleNavigate}
          />
        ))}

        <div className="relative inline-grid max-w-full grow basis-auto">
          <span
            aria-hidden
            className="invisible col-start-1 row-start-1 px-1.5 py-1 text-base whitespace-pre md:text-sm"
          >
            {inputValue || " "}
          </span>

          <input
            ref={inputRef}
            id={id}
            type="text"
            size={1}
            className="placeholder:text-muted-foreground col-start-1 row-start-1 w-full min-w-0 bg-transparent px-1.5 py-1 text-base outline-none md:text-sm"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={tags.length === 0 ? placeholder : undefined}
            autoFocus={autoFocus}
            enterKeyHint={enterKeyHint}
            autoCapitalize={autoCapitalize}
            disabled={atCapacity}
          />
        </div>
      </div>

      {addonEnd}
    </div>
  );
};
