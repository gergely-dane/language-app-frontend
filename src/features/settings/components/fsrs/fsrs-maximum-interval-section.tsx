"use client";

import { useId } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlert } from "@/context/alert-context";
import { useGetUserSettings } from "@/features/settings/api/get-user-settings";
import { useUpdateUserSettings } from "@/features/settings/api/update-user-settings";
import { UserSettingLoadError } from "@/features/settings/components/user-setting-load-error";
import { FSRS_MAXIMUM_INTERVAL_PRESETS } from "@/features/settings/constants";
import { useI18n } from "@/hooks/use-i18n";

export const FsrsMaximumIntervalSection = () => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const id = useId();

  const { data: settings, isLoading, isError, refetch } = useGetUserSettings();
  const updateUserSettings = useUpdateUserSettings();

  const title = t("settings.maximumIntervalTitle");

  if (!isLoading && (isError || !settings)) {
    return (
      <UserSettingLoadError title={title} onRetry={() => void refetch()} />
    );
  }

  const handleValueChange = async (value: string) => {
    const preset = FSRS_MAXIMUM_INTERVAL_PRESETS.find(
      (p) => p.days.toString() === value,
    );
    if (!settings || !preset) return;

    try {
      await updateUserSettings.mutateAsync({
        ...settings,
        fsrsMaximumIntervalDays: preset.days,
      });
      showAlert({
        title: t("settings.maximumIntervalSaved", {
          value: t(`settings.${preset.label}`),
        }),
        variant: "default",
      });
    } catch {
      showAlert({
        title: t("settings.settingsUpdateError"),
        variant: "destructive",
      });
    }
  };

  const selectedDays = updateUserSettings.isPending
    ? updateUserSettings.variables.fsrsMaximumIntervalDays
    : settings?.fsrsMaximumIntervalDays;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3
          id={`${id}-title`}
          className="font-sans text-sm font-semibold tracking-normal"
        >
          {title}
        </h3>

        <p id={`${id}-description`} className="text-muted-foreground text-sm">
          {t("settings.maximumIntervalDescription")}
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-9 min-h-9 w-full rounded-lg sm:w-81 sm:min-w-81" />
      ) : (
        <Tabs
          value={selectedDays?.toString()}
          onValueChange={(value) => void handleValueChange(value)}
        >
          <TabsList
            className="w-full sm:w-fit"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-description`}
          >
            {FSRS_MAXIMUM_INTERVAL_PRESETS.map((preset) => (
              <TabsTrigger
                key={preset.days}
                value={preset.days.toString()}
                disabled={updateUserSettings.isPending}
              >
                {t(`settings.${preset.label}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
    </section>
  );
};
