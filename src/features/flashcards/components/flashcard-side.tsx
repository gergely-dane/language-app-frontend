"use client";

import {
  IconArrowRight,
  IconChevronDown,
  IconHandClick,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLanguages } from "@/features/languages/api/get-languages";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/lib/utils";

type FlashcardSideProps = {
  translation?: Translation;
  isFront: boolean;
  flipped: boolean;
  forceHideBackface?: boolean;
  setEditDialogOpen?: (open: boolean) => void;
};

export const FlashcardSide = ({
  translation,
  isFront,
  flipped,
  forceHideBackface,
  setEditDialogOpen,
}: FlashcardSideProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const { getLanguageCode, getLanguageString } = useLanguages();

  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [translation]);

  const handleEditButtonClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen?.(true);
  };

  return (
    <div
      className={cn(
        "text-primary-foreground ring-foreground absolute inset-0 rounded-xl bg-gradient-to-br from-[oklch(from_var(--color-primary)_calc(l+0.05)_c_h)] to-[oklch(from_var(--color-primary)_calc(l-0.09)_c_h)] p-2 ring-2",
        !forceHideBackface && "backface-hidden",
        forceHideBackface && isFront === flipped && "hidden",
      )}
      style={{
        // slight z-separation prevents z-fighting between the coplanar faces.
        transform: isFront
          ? "translateZ(0.1px)"
          : "rotateY(180deg) translateZ(0.1px)",
      }}
    >
      {translation && (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="text-primary-foreground/75 absolute top-1 left-2 flex items-center gap-1 text-xs font-semibold uppercase">
            {getLanguageCode(
              isFront
                ? translation.sourceLanguageId
                : translation.targetLanguageId,
            )}
            <IconArrowRight size={12} />
            {getLanguageCode(
              isFront
                ? translation.targetLanguageId
                : translation.sourceLanguageId,
            )}
          </div>

          <div className="relative w-full px-6 text-center">
            <p className="text-primary-foreground/85 text-xs font-medium tracking-widest uppercase md:text-sm">
              {isFront
                ? getLanguageString(translation.sourceLanguageId)
                : getLanguageString(translation.targetLanguageId)}
            </p>

            <p
              className="line-clamp-3 text-2xl leading-snug font-semibold text-balance md:text-3xl"
              ref={textRef}
            >
              {isFront
                ? translation.words.map((w) => w.word).join(", ")
                : translation.translations
                    .map((translation) => translation.word)
                    .join(", ")}
            </p>

            {!isFront && (isClamped || !!translation.definition) && (
              <Button
                className="hover:bg-primary-foreground/10! absolute top-full left-1/2 -translate-x-1/2"
                variant="ghost"
                size="icon"
                onClick={handleEditButtonClicked}
              >
                <IconChevronDown className="mt-0.5" />
              </Button>
            )}
          </div>

          {isMobile && (
            <div className="text-primary-muted-foreground absolute bottom-0 w-full text-center text-xs">
              <div className="flex items-center justify-center gap-1.5">
                {t.rich(
                  isFront
                    ? "flashcards.tapToSeeTranslationsFront"
                    : "flashcards.tapToSeeTranslationsBack",
                  {
                    hand: () => <IconHandClick />,
                  },
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
