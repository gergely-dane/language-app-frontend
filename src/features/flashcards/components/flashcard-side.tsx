"use client";

import { IconArrowRight, IconHandClick } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import { FlashcardPlayButton } from "@/features/flashcards/components/flashcard-play-button";
import { useLanguages } from "@/features/languages/api/get-languages";
import { DefinitionInfo } from "@/features/vocabulary/components/definition-info";
import type { Translation } from "@/features/vocabulary/types";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { cn } from "@/lib/utils";

type FlashcardSideProps = {
  translation: Translation;
  isFront: boolean;
  showsDefinition: boolean;
};

export const FlashcardSide = ({
  translation,
  isFront,
  showsDefinition,
}: FlashcardSideProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const { getLanguageCode, getLanguageString } = useLanguages();

  return (
    <div
      className="text-primary-foreground ring-foreground absolute inset-0 rounded-xl bg-gradient-to-br from-[oklch(from_var(--color-primary)_calc(l+0.05)_c_h)] to-[oklch(from_var(--color-primary)_calc(l-0.09)_c_h)] p-2 ring-2 backface-hidden"
      style={{
        // slight z-separation prevents z-fighting between the coplanar faces.
        transform: isFront
          ? "translateZ(0.1px)"
          : "rotateY(180deg) translateZ(0.1px)",
      }}
    >
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="absolute -top-1 -right-1 flex items-center gap-1">
          {showsDefinition && !!translation.definition && (
            <DefinitionInfo
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "hover:bg-primary-foreground/10! text-primary-foreground/70 hover:text-primary-foreground size-8",
              )}
              iconClassName="size-5"
              definition={translation.definition}
            />
          )}

          <FlashcardPlayButton
            text={
              isFront
                ? translation.words.map((w) => w.word).join(", ")
                : translation.translations.map((tr) => tr.word).join(", ")
            }
            languageCode={getLanguageCode(
              isFront
                ? translation.sourceLanguageId
                : translation.targetLanguageId,
            )}
          />
        </div>

        <div className="text-primary-foreground/75 absolute top-1 right-20 left-2 flex items-center gap-1 text-[13px] font-semibold">
          <span className="min-w-0 truncate">
            {getLanguageString(
              isFront
                ? translation.sourceLanguageId
                : translation.targetLanguageId,
            )}
          </span>

          <IconArrowRight className="shrink-0" size={13} />

          <span className="min-w-0 truncate">
            {getLanguageString(
              isFront
                ? translation.targetLanguageId
                : translation.sourceLanguageId,
            )}
          </span>
        </div>

        <div className="w-full px-6 text-center">
          <p className="text-primary-foreground/85 text-xs font-medium tracking-widest uppercase md:text-sm">
            {isFront
              ? getLanguageString(translation.sourceLanguageId)
              : getLanguageString(translation.targetLanguageId)}
          </p>

          <p className="line-clamp-3 text-2xl leading-snug font-semibold text-balance md:text-3xl">
            {isFront
              ? translation.words.map((w) => w.word).join(", ")
              : translation.translations
                  .map((translation) => translation.word)
                  .join(", ")}
          </p>
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
    </div>
  );
};
