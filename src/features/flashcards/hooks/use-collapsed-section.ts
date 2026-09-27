"use client";

import { useSyncExternalStore } from "react";

import { SHORT_SCREEN_MEDIA_QUERY } from "@/features/flashcards/constants";
import type {
  FlashcardCollapsedSections,
  FlashcardSection,
} from "@/features/flashcards/types";
import {
  getStoredCollapsedSections,
  storeCollapsedSections,
} from "@/features/flashcards/utils";

const serverSnapshot: FlashcardCollapsedSections = {};

let collapsedSections: FlashcardCollapsedSections | null = null;
const listeners = new Set<() => void>();

const collapsedSectionsStore = {
  getSnapshot: () => (collapsedSections ??= getStoredCollapsedSections()),
  getServerSnapshot: () => serverSnapshot,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setCollapsed: (section: FlashcardSection, collapsed: boolean) => {
    collapsedSections = {
      ...collapsedSectionsStore.getSnapshot(),
      [section]: collapsed,
    };
    storeCollapsedSections(collapsedSections);
    listeners.forEach((listener) => listener());
  },
};

const shortScreenStore = {
  getSnapshot: () => window.matchMedia(SHORT_SCREEN_MEDIA_QUERY).matches,
  getServerSnapshot: () => false,
  subscribe: (listener: () => void) => {
    const mediaQuery = window.matchMedia(SHORT_SCREEN_MEDIA_QUERY);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  },
};

export const useCollapsedSection = (
  section: FlashcardSection,
  defaultCollapsedOnShortScreen = false,
) => {
  const sections = useSyncExternalStore(
    collapsedSectionsStore.subscribe,
    collapsedSectionsStore.getSnapshot,
    collapsedSectionsStore.getServerSnapshot,
  );

  const isShortScreen = useSyncExternalStore(
    shortScreenStore.subscribe,
    shortScreenStore.getSnapshot,
    shortScreenStore.getServerSnapshot,
  );

  const isCollapsed =
    sections[section] ?? (defaultCollapsedOnShortScreen && isShortScreen);

  const toggle = () =>
    collapsedSectionsStore.setCollapsed(section, !isCollapsed);

  return { isCollapsed, toggle };
};
