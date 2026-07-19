"use client";

import { IconVolume } from "@tabler/icons-react";
import { useState } from "react";

import { useSynthesizeSpeech } from "@/features/vocabulary/api/synthesize-speech";

const audioCache = new Map<string, string>();

interface PlayAudioButtonProps {
  text: string;
  languageCode: string;
}

export const PlayAudioButton = ({
  text,
  languageCode,
}: PlayAudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthesizeSpeech = useSynthesizeSpeech();

  const handlePlayAudio = async () => {
    if (isPlaying) return;

    setIsPlaying(true);

    const cacheKey = `${text}_${languageCode}`;
    let url = audioCache.get(cacheKey);

    if (!url) {
      try {
        const blob = await synthesizeSpeech.mutateAsync({
          text,
          languageCode,
        });
        url = URL.createObjectURL(blob);
        audioCache.set(cacheKey, url);
      } catch (error) {
        console.error("Failed to play audio", error);
        setIsPlaying(false);
        return;
      }
    }

    const audio = new Audio(url);

    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

    void audio.play();
  };

  return (
    <button
      onClick={() => void handlePlayAudio()}
      disabled={synthesizeSpeech.isPending}
      className={`hover:text-primary -mb-0.5 cursor-pointer transition-colors ${
        isPlaying
          ? "text-primary disabled:opacity-100"
          : "text-primary/50 disabled:opacity-50"
      }`}
      aria-label="Play audio"
    >
      <IconVolume size={16} />
    </button>
  );
};
