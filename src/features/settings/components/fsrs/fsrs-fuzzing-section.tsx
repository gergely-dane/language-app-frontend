"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAlert } from "@/context/alert-context";
import { useGetUserSettings } from "@/features/settings/api/get-user-settings";
import { useUpdateUserSettings } from "@/features/settings/api/update-user-settings";
import { useI18n } from "@/hooks/use-i18n";

export const FsrsFuzzingSection = () => {
  const t = useI18n();
  const { showAlert } = useAlert();

  const { data: settings, isLoading, isError, refetch } = useGetUserSettings();
  const updateUserSettings = useUpdateUserSettings();

  const handleCheckedChange = async (fsrsFuzzingEnabled: boolean) => {
    if (!settings) return;

    try {
      await updateUserSettings.mutateAsync({ ...settings, fsrsFuzzingEnabled });
      showAlert({
        title: fsrsFuzzingEnabled
          ? t("settings.fuzzingEnabled")
          : t("settings.fuzzingDisabled"),
        variant: "default",
      });
    } catch {
      showAlert({
        title: t("settings.settingsUpdateError"),
        variant: "destructive",
      });
    }
  };

  if (!isLoading && (isError || !settings)) {
    return (
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">{t("settings.fuzzingTitle")}</h3>

        <p className="text-muted-foreground text-sm">
          {t("settings.settingsLoadError")}
        </p>

        <Button
          variant="outline"
          className="w-fit"
          onClick={() => void refetch()}
        >
          {t("settings.retry")}
        </Button>
      </section>
    );
  }

  const isEnabled = updateUserSettings.isPending
    ? updateUserSettings.variables.fsrsFuzzingEnabled
    : settings?.fsrsFuzzingEnabled;

  return (
    <section className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h3 id="fsrs-fuzzing-title" className="text-sm font-semibold">
          {t("settings.fuzzingTitle")}
        </h3>

        <p
          id="fsrs-fuzzing-description"
          className="text-muted-foreground text-sm"
        >
          {t("settings.fuzzingDescription")}
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-[1.15rem] min-h-[1.15rem] w-8 min-w-8 shrink-0 rounded-full" />
      ) : (
        <Switch
          aria-labelledby="fsrs-fuzzing-title"
          aria-describedby="fsrs-fuzzing-description"
          checked={isEnabled}
          disabled={updateUserSettings.isPending}
          onCheckedChange={(checked) => void handleCheckedChange(checked)}
        />
      )}
    </section>
  );
};
