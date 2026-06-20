"use client";

import {
  IconArrowRight,
  IconChevronDown,
  IconHandClick,
  IconLanguage,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useLanguages } from "@/features/languages/api/get-languages";
import type { Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/utils/cn";

type FlashcardSideProps = {
  translation: Translation;
  isFront: boolean;
  flipped: boolean;
  swipeAnimationPlaying?: boolean;
  setEditDialogOpen?: (open: boolean) => void;
};

export const FlashcardSide = ({
  translation,
  isFront,
  flipped,
  swipeAnimationPlaying,
  setEditDialogOpen,
}: FlashcardSideProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const { getLanguageString } = useLanguages();

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
        "bg-primary text-primary-foreground ring-foreground absolute inset-0 rounded-xl p-2 ring-2",
        !swipeAnimationPlaying && "backface-hidden",
      )}
      style={{ transform: isFront ? undefined : "rotateY(180deg)" }}
    >
      <div
        className={cn(
          "relative flex h-full flex-col items-center justify-center",
          swipeAnimationPlaying && isFront === flipped && "hidden",
        )}
      >
        <div className="relative text-center">
          <div className="mx-auto flex w-fit">
            <IconLanguage className="my-auto mr-1" />

            <p className="my-auto text-sm">
              {isFront
                ? getLanguageString(translation.sourceLanguageId)
                : getLanguageString(translation.translationLanguageId)}
            </p>

            <IconArrowRight className="mx-2 mt-1.5" size={16} />

            <p className="my-auto text-sm">
              {isFront
                ? getLanguageString(translation.translationLanguageId)
                : getLanguageString(translation.sourceLanguageId)}
            </p>
          </div>

          <p className="line-clamp-3 text-xl" ref={textRef}>
            {isFront
              ? translation.word.word
              : translation.translations
                  .map((translation) => translation.word)
                  .join(", ")}
          </p>

          {!isFront && (isClamped || !!translation.definition) && (
            <Button
              className="hover:bg-primary! absolute top-full left-1/2 -translate-x-1/2"
              variant="ghost"
              size="icon"
              onClick={handleEditButtonClicked}
            >
              <IconChevronDown className="mt-0.5" />
            </Button>
          )}
        </div>

        <div className="text-primary-muted-foreground absolute bottom-0 w-full text-center text-sm">
          {!isMobile ? (
            <div>
              {t.rich(
                isFront
                  ? "flashcards.clickOrPressSpaceFront"
                  : "flashcards.clickOrPressSpaceBack",
                {
                  space: (chunks) => (
                    <Kbd className="bg-muted/50">{chunks}</Kbd>
                  ),
                },
              )}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};
