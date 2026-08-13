"use client";

import { IconVolume } from "@tabler/icons-react";
import { useState, useSyncExternalStore } from "react";

import { useSynthesizeSpeech } from "@/features/vocabulary/api/synthesize-speech";

const audioCache = new Map<string, string>();

let globalIsPlaying = false;
const listeners = new Set<() => void>();

const audioStore = {
  getSnapshot: () => globalIsPlaying,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setPlaying: (playing: boolean) => {
    globalIsPlaying = playing;
    listeners.forEach((listener) => listener());
  },
};

interface PlayAudioButtonProps {
  text: string;
  languageCode: string;
}

export const PlayAudioButton = ({
  text,
  languageCode,
}: PlayAudioButtonProps) => {
  const [isThisPlaying, setIsThisPlaying] = useState(false);

  const isAnyAudioPlaying = useSyncExternalStore(
    audioStore.subscribe,
    audioStore.getSnapshot,
    audioStore.getSnapshot,
  );

  const synthesizeSpeech = useSynthesizeSpeech();

  const cleanup = () => {
    setIsThisPlaying(false);
    audioStore.setPlaying(false);
  };

  const getAudioUrl = async () => {
    const cacheKey = `${text}_${languageCode}`;

    const cached = audioCache.get(cacheKey);
    if (cached) return cached;

    const blob = await synthesizeSpeech.mutateAsync({
      text,
      languageCode,
    });

    const url = URL.createObjectURL(blob);
    audioCache.set(cacheKey, url);

    return url;
  };

  const handlePlayAudio = async () => {
    if (isThisPlaying || isAnyAudioPlaying) return;

    setIsThisPlaying(true);
    audioStore.setPlaying(true);

    try {
      const url = await getAudioUrl();
      const audio = new Audio(url);

      audio.onended = cleanup;
      audio.onerror = cleanup;

      await audio.play();
    } catch (error) {
      console.error("Failed to play audio", error);
      cleanup();
    }
  };

  const isDisabled =
    synthesizeSpeech.isPending || (isAnyAudioPlaying && !isThisPlaying);

  const className = [
    "-mb-0.5 shrink-0 transition-[color,opacity]",
    "opacity-0 group-hover:opacity-100 max-lg:opacity-100",
    isThisPlaying
      ? "text-primary cursor-default opacity-100"
      : isDisabled
        ? "text-muted-foreground/50 cursor-default"
        : "text-muted-foreground hover:text-foreground cursor-pointer",
  ].join(" ");

  return (
    <button
      onClick={() => void handlePlayAudio()}
      disabled={isDisabled}
      className={className}
      aria-label="Play audio"
    >
      <IconVolume size={16} />
    </button>
  );
};
