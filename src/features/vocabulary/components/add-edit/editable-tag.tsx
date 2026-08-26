"use client";

import { IconX } from "@tabler/icons-react";
import { motion } from "motion/react";
import { type KeyboardEvent, type PointerEvent, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  TAG_DRAG_THRESHOLD_PX,
  TAG_REORDER_COOLDOWN_MS,
} from "@/features/vocabulary/constants";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type EditableTagProps = {
  tag: string;
  index: number;
  isEditing: boolean;
  onStartEdit: (index: number) => void;
  onCommitEdit: (index: number, value: string) => void;
  onCancelEdit: () => void;
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  onNavigate: (index: number, direction: -1 | 1) => void;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
};

export const EditableTag = ({
  tag,
  index,
  isEditing,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onRemove,
  onReorder,
  onNavigate,
}: EditableTagProps) => {
  const t = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const wasDraggedRef = useRef(false);
  const lastReorderAtRef = useRef(0);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    if (!drag.moved) {
      const distance = Math.hypot(
        e.clientX - drag.startX,
        e.clientY - drag.startY,
      );
      if (distance < TAG_DRAG_THRESHOLD_PX) return;

      drag.moved = true;
      setIsDragging(true);
    }

    // cooldown lets layout animations settle so hit-testing does not oscillate
    if (Date.now() - lastReorderAtRef.current < TAG_REORDER_COOLDOWN_MS) return;

    const over = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest<HTMLElement>("[data-tag-index]");
    if (!over) return;

    const overIndex = Number(over.dataset.tagIndex);
    const currentIndex = Number(e.currentTarget.dataset.tagIndex);
    if (Number.isNaN(overIndex) || overIndex === currentIndex) return;

    lastReorderAtRef.current = Date.now();
    onReorder(currentIndex, overIndex);
  };

  const handlePointerEnd = () => {
    if (!dragRef.current) return;

    if (dragRef.current.moved) {
      wasDraggedRef.current = true;
      setIsDragging(false);
    }
    dragRef.current = null;
  };

  const handleClick = () => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    onStartEdit(index);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      onRemove(index);
      return;
    }

    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    e.preventDefault();
    const direction = e.key === "ArrowLeft" ? -1 : 1;

    if (e.altKey) {
      onReorder(index, index + direction);
    } else {
      onNavigate(index, direction);
    }
  };

  return (
    <Badge asChild>
      <motion.span
        layout
        data-tag-index={index}
        className={cn(
          "animate-in fade-in zoom-in-90 shrink-0 gap-1 py-0.5 pl-2 text-base duration-100 md:text-sm",
          isEditing ? "pr-2" : "pr-1",
          isDragging && "ring-ring/50 z-10 opacity-80 ring-2",
        )}
      >
        {isEditing ? (
          <TagEditInput
            initialValue={tag}
            onCommit={(value) => onCommitEdit(index, value)}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            <button
              type="button"
              data-tag-button
              data-tag-index={index}
              className="focus-visible:ring-primary-foreground/40 max-w-32 cursor-grab touch-none truncate rounded-sm outline-none focus-visible:ring-2 active:cursor-grabbing"
              aria-label={t("vocabulary.editEntry", { value: tag })}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
            >
              {tag}
            </button>

            <button
              type="button"
              className="hover:bg-primary-foreground/20 focus-visible:ring-primary-foreground/40 flex cursor-pointer items-center rounded-full p-0.5 transition-colors outline-none focus-visible:ring-2"
              aria-label={t("vocabulary.removeEntry", { value: tag })}
              onClick={() => onRemove(index)}
            >
              <IconX size={12} />
            </button>
          </>
        )}
      </motion.span>
    </Badge>
  );
};

type TagEditInputProps = {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
};

const TagEditInput = ({
  initialValue,
  onCommit,
  onCancel,
}: TagEditInputProps) => {
  const [draft, setDraft] = useState(initialValue);
  const settledRef = useRef(false);

  const settle = (action: () => void) => {
    if (settledRef.current) return;
    settledRef.current = true;
    action();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      settle(() => onCommit(draft));
      return;
    }

    if (e.key === "Escape") {
      e.stopPropagation();
      settle(onCancel);
    }
  };

  return (
    <span className="inline-grid max-w-40">
      <span className="invisible col-start-1 row-start-1 truncate whitespace-pre">
        {draft || " "}
      </span>

      <input
        className="col-start-1 row-start-1 w-full min-w-4 bg-transparent outline-none"
        value={draft}
        size={1}
        autoFocus
        autoCapitalize="none"
        enterKeyHint="done"
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => settle(() => onCommit(draft))}
      />
    </span>
  );
};
