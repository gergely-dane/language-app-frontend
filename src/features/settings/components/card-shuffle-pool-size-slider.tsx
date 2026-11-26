"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { useAlert } from "@/context/alert-context";
import { useUpdateUserSettings } from "@/features/settings/api/update-user-settings";
import {
  CARD_SHUFFLE_POOL_SIZE_MAX,
  CARD_SHUFFLE_POOL_SIZE_MIN,
  CARD_SHUFFLE_POOL_SIZE_SAVE_DELAY_MS,
} from "@/features/settings/constants";
import { type UserSettings } from "@/features/settings/types";
import { useI18n } from "@/hooks/use-i18n";

type CardShufflePoolSizeSliderProps = {
  settings: UserSettings;
};

export const CardShufflePoolSizeSlider = ({
  settings,
}: CardShufflePoolSizeSliderProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const id = useId();
  const updateUserSettings = useUpdateUserSettings();

  const [draft, setDraft] = useState<number | null>(null);
  const value = draft ?? settings.cardShufflePoolSize;
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(saveTimeoutRef.current), []);

  const clearDraft = (savedValue: number) =>
    setDraft((current) => (current === savedValue ? null : current));

  const save = async (cardShufflePoolSize: number) => {
    if (cardShufflePoolSize === settings.cardShufflePoolSize) {
      clearDraft(cardShufflePoolSize);
      return;
    }

    try {
      await updateUserSettings.mutateAsync({
        ...settings,
        cardShufflePoolSize,
      });
      showAlert({
        title: t("settings.cardShufflePoolSizeSaved", {
          count: cardShufflePoolSize,
        }),
        variant: "default",
      });
    } catch {
      showAlert({
        title: t("settings.settingsUpdateError"),
        variant: "destructive",
      });
    } finally {
      clearDraft(cardShufflePoolSize);
    }
  };

  const handleValueCommit = (cardShufflePoolSize: number) => {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(
      () => void save(cardShufflePoolSize),
      CARD_SHUFFLE_POOL_SIZE_SAVE_DELAY_MS,
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h4
            id={`${id}-title`}
            className="font-sans text-sm font-semibold tracking-normal"
          >
            {t("settings.cardShufflePoolSizeTitle")}
          </h4>

          <p id={`${id}-description`} className="text-muted-foreground text-sm">
            {t("settings.cardShufflePoolSizeDescription")}
          </p>
        </div>

        <span className="font-mono text-sm font-medium tabular-nums">
          {value}
        </span>
      </div>

      <Slider
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        min={CARD_SHUFFLE_POOL_SIZE_MIN}
        max={CARD_SHUFFLE_POOL_SIZE_MAX}
        step={1}
        value={[value]}
        onValueChange={([next]) => setDraft(next)}
        onValueCommit={([next]) => handleValueCommit(next)}
      />
    </section>
  );
};
