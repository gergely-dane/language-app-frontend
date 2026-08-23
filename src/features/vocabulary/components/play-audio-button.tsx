"use client";

import { IconVolume } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { usePlayAudio } from "@/features/vocabulary/hooks/use-play-audio";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface PlayAudioButtonProps {
  text: string;
  languageCode: string;
}

export const PlayAudioButton = ({
  text,
  languageCode,
}: PlayAudioButtonProps) => {
  const t = useI18n();
  const { play, isPlaying, isDisabled } = usePlayAudio(text, languageCode);

  return (
    <Button
      variant="ghost"
      size="icon"
      ripple={!isDisabled && !isPlaying}
      onClick={() => void play()}
      aria-label={t("flashcards.playAudio")}
      className={cn(
        "hover:bg-muted dark:hover:bg-muted -mt-1 -mb-[5px] size-5.5 shrink-0 opacity-0 group-hover:opacity-100 max-lg:opacity-100",
        isPlaying
          ? "text-primary cursor-default opacity-100"
          : isDisabled
            ? "text-muted-foreground/50 hover:text-muted-foreground/50 cursor-default hover:bg-transparent dark:hover:bg-transparent"
            : "text-muted-foreground",
      )}
    >
      <IconVolume className="size-4" />
    </Button>
  );
};
