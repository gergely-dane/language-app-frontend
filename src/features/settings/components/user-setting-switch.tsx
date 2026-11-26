"use client";

import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAlert } from "@/context/alert-context";
import { useGetUserSettings } from "@/features/settings/api/get-user-settings";
import { useUpdateUserSettings } from "@/features/settings/api/update-user-settings";
import { type UserSettings } from "@/features/settings/types";
import { useI18n } from "@/hooks/use-i18n";

type UserSettingSwitchProps = {
  setting: keyof UserSettings;
  title: string;
  description: string;
  enabledMessage: string;
  disabledMessage: string;
};

export const UserSettingSwitch = ({
  setting,
  title,
  description,
  enabledMessage,
  disabledMessage,
}: UserSettingSwitchProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const id = useId();

  const { data: settings, isLoading, isError, refetch } = useGetUserSettings();
  const updateUserSettings = useUpdateUserSettings();

  const handleCheckedChange = async (checked: boolean) => {
    if (!settings) return;

    try {
      await updateUserSettings.mutateAsync({ ...settings, [setting]: checked });
      showAlert({
        title: checked ? enabledMessage : disabledMessage,
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
        <h3 className="font-sans text-sm font-semibold tracking-normal">
          {title}
        </h3>

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
    ? updateUserSettings.variables[setting]
    : settings?.[setting];

  return (
    <section className="flex items-center justify-between gap-4">
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

      {isLoading ? (
        <Skeleton className="h-[1.15rem] min-h-[1.15rem] w-8 min-w-8 shrink-0 rounded-full" />
      ) : (
        <Switch
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          checked={isEnabled}
          disabled={updateUserSettings.isPending}
          onCheckedChange={(checked) => void handleCheckedChange(checked)}
        />
      )}
    </section>
  );
};
