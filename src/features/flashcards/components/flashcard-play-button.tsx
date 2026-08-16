"use client";

import { IconVolume } from "@tabler/icons-react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { usePlayAudio } from "@/features/vocabulary/hooks/use-play-audio";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

type FlashcardPlayButtonProps = {
  text: string;
  languageCode: string;
  className?: string;
};

export const FlashcardPlayButton = ({
  text,
  languageCode,
  className,
}: FlashcardPlayButtonProps) => {
  const t = useI18n();
  const { play, isPlaying, isDisabled } = usePlayAudio(text, languageCode);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    void play();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      ripple={!isDisabled && !isPlaying}
      onClick={handleClick}
      aria-label={t("flashcards.playAudio")}
      className={cn(
        "hover:bg-primary-foreground/10! size-7",
        isPlaying
          ? "text-primary-foreground cursor-default"
          : isDisabled
            ? "text-primary-foreground/40 hover:text-primary-foreground/40 cursor-default hover:bg-transparent!"
            : "text-primary-foreground/70 hover:text-primary-foreground",
        className,
      )}
    >
      <IconVolume className="size-4.5" />
    </Button>
  );
};
