"use client";

import { useGetUserSettings } from "@/features/settings/api/get-user-settings";
import { UserSettingSlider } from "@/features/settings/components/user-setting-slider";
import { UserSettingSwitch } from "@/features/settings/components/user-setting-switch";
import {
  CARD_SHUFFLE_POOL_SIZE_MAX,
  CARD_SHUFFLE_POOL_SIZE_MIN,
} from "@/features/settings/constants";
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
        <UserSettingSlider
          setting="cardShufflePoolSize"
          title={t("settings.cardShufflePoolSizeTitle")}
          description={t("settings.cardShufflePoolSizeDescription")}
          min={CARD_SHUFFLE_POOL_SIZE_MIN}
          max={CARD_SHUFFLE_POOL_SIZE_MAX}
          step={1}
          formatValue={(value) => value.toString()}
          getSavedMessage={(value) =>
            t("settings.cardShufflePoolSizeSaved", { count: value })
          }
        />
      )}
    </div>
  );
};
