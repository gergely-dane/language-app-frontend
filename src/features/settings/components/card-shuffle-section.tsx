"use client";

import { useGetUserSettings } from "@/features/settings/api/get-user-settings";
import { CardShufflePoolSizeSlider } from "@/features/settings/components/card-shuffle-pool-size-slider";
import { UserSettingSwitch } from "@/features/settings/components/user-setting-switch";
import { useI18n } from "@/hooks/use-i18n";

export const CardShuffleSection = () => {
  const t = useI18n();
  const { data: settings } = useGetUserSettings();

  return (
    <div className="flex flex-col gap-4">
      <UserSettingSwitch
        setting="cardShuffleEnabled"
        title={t("settings.cardShuffleTitle")}
        description={t("settings.cardShuffleDescription")}
        enabledMessage={t("settings.cardShuffleEnabled")}
        disabledMessage={t("settings.cardShuffleDisabled")}
      />

      {settings?.cardShuffleEnabled && (
        <CardShufflePoolSizeSlider settings={settings} />
      )}
    </div>
  );
};
