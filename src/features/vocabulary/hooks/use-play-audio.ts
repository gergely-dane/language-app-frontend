"use client";

import { useState, useSyncExternalStore } from "react";

import { useSynthesizeSpeech } from "@/features/vocabulary/api/synthesize-speech";
import { MAX_AUDIO_CACHE_ENTRIES } from "@/features/vocabulary/constants";
import { setWithEvictOldest } from "@/features/vocabulary/utils";

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

export const usePlayAudio = (text: string, languageCode: string) => {
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
    setWithEvictOldest(
      audioCache,
      cacheKey,
      url,
      MAX_AUDIO_CACHE_ENTRIES,
      (evictedUrl) => URL.revokeObjectURL(evictedUrl),
    );

    return url;
  };

  const play = async () => {
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

  return { play, isPlaying: isThisPlaying, isDisabled };
};
