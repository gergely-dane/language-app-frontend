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
import { FsrsOptimizationSection } from "@/features/settings/components/fsrs/fsrs-optimization-section";
import { UserSettingSwitch } from "@/features/settings/components/user-setting-switch";
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

        <CardShuffleSection />

        <Separator />

        <FsrsOptimizationSection />
      </CardContent>
    </Card>
  );
};
