"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CardShuffleSection } from "@/features/settings/components/card-shuffle-section";
import { FsrsMaximumIntervalSection } from "@/features/settings/components/fsrs/fsrs-maximum-interval-section";
import { FsrsOptimizationSection } from "@/features/settings/components/fsrs/fsrs-optimization-section";
import { UserSettingSlider } from "@/features/settings/components/user-setting-slider";
import { UserSettingSwitch } from "@/features/settings/components/user-setting-switch";
import {
  FSRS_DESIRED_RETENTION_MAX,
  FSRS_DESIRED_RETENTION_MIN,
  FSRS_DESIRED_RETENTION_STEP,
} from "@/features/settings/constants";
import { formatPercent } from "@/features/settings/utils";
import { useI18n } from "@/hooks/use-i18n";

export const FlashcardSettingsCard = () => {
  const t = useI18n();

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{t("settings.flashcardSettings")}</CardTitle>
        <CardDescription>
          {t("settings.flashcardSettingsDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <UserSettingSwitch
          setting="fsrsFuzzingEnabled"
          title={t("settings.fuzzingTitle")}
          description={t("settings.fuzzingDescription")}
          enabledMessage={t("settings.fuzzingEnabled")}
          disabledMessage={t("settings.fuzzingDisabled")}
        />

        <Separator />

        <UserSettingSlider
          setting="fsrsDesiredRetention"
          title={t("settings.desiredRetentionTitle")}
          description={t("settings.desiredRetentionDescription")}
          min={FSRS_DESIRED_RETENTION_MIN}
          max={FSRS_DESIRED_RETENTION_MAX}
          step={FSRS_DESIRED_RETENTION_STEP}
          formatValue={formatPercent}
          getSavedMessage={(value) =>
            t("settings.desiredRetentionSaved", { value: formatPercent(value) })
          }
        />

        <Separator />

        <FsrsMaximumIntervalSection />

        <Separator />

        <CardShuffleSection />

        <Separator />

        <UserSettingSwitch
          setting="disableEasyForNewCards"
          title={t("settings.disableEasyForNewCardsTitle")}
          description={t("settings.disableEasyForNewCardsDescription")}
          enabledMessage={t("settings.disableEasyForNewCardsEnabled")}
          disabledMessage={t("settings.disableEasyForNewCardsDisabled")}
        />

        <Separator />

        <FsrsOptimizationSection />
      </CardContent>
    </Card>
  );
};
