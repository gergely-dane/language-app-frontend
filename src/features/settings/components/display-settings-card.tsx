"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserSettingSlider } from "@/features/settings/components/user-setting-slider";
import { UserSettingSwitch } from "@/features/settings/components/user-setting-switch";
import {
  TTS_SPEAKING_RATE_MAX,
  TTS_SPEAKING_RATE_MIN,
  TTS_SPEAKING_RATE_STEP,
} from "@/features/settings/constants";
import { formatSpeakingRate } from "@/features/settings/utils";
import { useI18n } from "@/hooks/use-i18n";

export const DisplaySettingsCard = () => {
  const t = useI18n();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{t("settings.displaySettings")}</CardTitle>
        <CardDescription>
          {t("settings.displaySettingsDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <UserSettingSwitch
          setting="showNativeLanguageNames"
          title={t("settings.nativeLanguageNamesTitle")}
          description={t("settings.nativeLanguageNamesDescription")}
          enabledMessage={t("settings.nativeLanguageNamesEnabled")}
          disabledMessage={t("settings.nativeLanguageNamesDisabled")}
        />

        <Separator />

        <UserSettingSwitch
          setting="disableFlashcardAnimations"
          title={t("settings.disableFlashcardAnimationsTitle")}
          description={t("settings.disableFlashcardAnimationsDescription")}
          enabledMessage={t("settings.disableFlashcardAnimationsEnabled")}
          disabledMessage={t("settings.disableFlashcardAnimationsDisabled")}
        />

        <Separator />

        <UserSettingSlider
          setting="ttsSpeakingRate"
          title={t("settings.ttsSpeakingRateTitle")}
          description={t("settings.ttsSpeakingRateDescription")}
          min={TTS_SPEAKING_RATE_MIN}
          max={TTS_SPEAKING_RATE_MAX}
          step={TTS_SPEAKING_RATE_STEP}
          formatValue={formatSpeakingRate}
          getSavedMessage={(value) =>
            t("settings.ttsSpeakingRateSaved", {
              value: formatSpeakingRate(value),
            })
          }
        />
      </CardContent>
    </Card>
  );
};
