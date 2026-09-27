"use client";

import { useCallback, useEffect, useState } from "react";

import {
  FLASHCARD_SESSION_IDLE_TIMEOUT_MS,
  FLASHCARD_SESSION_STATE_STORAGE_KEY,
} from "@/features/flashcards/constants";
import type {
  FlashcardRating,
  FlashcardSessionState,
} from "@/features/flashcards/types";
import { flashcardSessionStateSchema } from "@/features/flashcards/types";

const emptySession: FlashcardSessionState = { lastActivityAt: 0, history: [] };

const isSessionExpired = (session: FlashcardSessionState) =>
  session.history.length === 0 ||
  Date.now() - session.lastActivityAt > FLASHCARD_SESSION_IDLE_TIMEOUT_MS;

const loadStoredSession = (): FlashcardSessionState => {
  if (typeof window === "undefined") return emptySession;

  const stored = window.localStorage.getItem(
    FLASHCARD_SESSION_STATE_STORAGE_KEY,
  );

  if (!stored) return emptySession;

  try {
    const result = flashcardSessionStateSchema.safeParse(JSON.parse(stored));
    if (!result.success || isSessionExpired(result.data)) return emptySession;
    return result.data;
  } catch (error) {
    console.error("Error parsing stored flashcard session state:", error);
    return emptySession;
  }
};

export const useFlashcardSession = () => {
  const [session, setSession] =
    useState<FlashcardSessionState>(loadStoredSession);

  useEffect(() => {
    if (session.history.length === 0) {
      window.localStorage.removeItem(FLASHCARD_SESSION_STATE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      FLASHCARD_SESSION_STATE_STORAGE_KEY,
      JSON.stringify(session),
    );
  }, [session]);

  const recordResponse = useCallback((rating: FlashcardRating) => {
    setSession((prev) => ({
      lastActivityAt: Date.now(),
      history: isSessionExpired(prev) ? [rating] : [...prev.history, rating],
    }));
  }, []);

  return { sessionHistory: session.history, recordResponse };
};
