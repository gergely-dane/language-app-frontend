"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useAlert } from "@/context/alert-context";
import { useGetUserSettings } from "@/features/settings/api/get-user-settings";
import { useUpdateUserSettings } from "@/features/settings/api/update-user-settings";
import { UserSettingLoadError } from "@/features/settings/components/user-setting-load-error";
import { USER_SETTING_SLIDER_SAVE_DELAY_MS } from "@/features/settings/constants";
import { type UserSettings } from "@/features/settings/types";
import { useI18n } from "@/hooks/use-i18n";

type NumericUserSetting = {
  [K in keyof UserSettings]: UserSettings[K] extends number ? K : never;
}[keyof UserSettings];

type UserSettingSliderProps = {
  setting: NumericUserSetting;
  title: string;
  description: string;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  getSavedMessage: (value: number) => string;
};

export const UserSettingSlider = ({
  setting,
  title,
  description,
  min,
  max,
  step,
  formatValue,
  getSavedMessage,
}: UserSettingSliderProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const id = useId();

  const { data: settings, isLoading, isError, refetch } = useGetUserSettings();
  const updateUserSettings = useUpdateUserSettings();

  const [draft, setDraft] = useState<number | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(saveTimeoutRef.current), []);

  if (!isLoading && (isError || !settings)) {
    return (
      <UserSettingLoadError title={title} onRetry={() => void refetch()} />
    );
  }

  const value = draft ?? settings?.[setting];

  const clearDraft = (savedValue: number) =>
    setDraft((current) => (current === savedValue ? null : current));

  const save = async (nextValue: number) => {
    if (!settings || nextValue === settings[setting]) {
      clearDraft(nextValue);
      return;
    }

    try {
      await updateUserSettings.mutateAsync({
        ...settings,
        [setting]: nextValue,
      });
      showAlert({ title: getSavedMessage(nextValue), variant: "default" });
    } catch {
      showAlert({
        title: t("settings.settingsUpdateError"),
        variant: "destructive",
      });
    } finally {
      clearDraft(nextValue);
    }
  };

  const handleValueCommit = (nextValue: number) => {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(
      () => void save(nextValue),
      USER_SETTING_SLIDER_SAVE_DELAY_MS,
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3
            id={`${id}-title`}
            className="font-sans text-sm font-semibold tracking-normal"
          >
            {title}
          </h3>

          <p id={`${id}-description`} className="text-muted-foreground text-sm">
            {description}
          </p>
        </div>

        {value === undefined ? (
          <Skeleton className="h-5 min-h-5 w-10 min-w-10 shrink-0" />
        ) : (
          <span className="font-mono text-sm font-medium tabular-nums">
            {formatValue(value)}
          </span>
        )}
      </div>

      {value === undefined ? (
        <Skeleton className="h-4 min-h-4 w-full rounded-full" />
      ) : (
        <Slider
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([next]) => setDraft(next)}
          onValueCommit={([next]) => handleValueCommit(next)}
        />
      )}
    </section>
  );
};
