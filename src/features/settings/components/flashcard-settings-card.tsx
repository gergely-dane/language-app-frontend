"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FsrsFuzzingSection } from "@/features/settings/components/fsrs/fsrs-fuzzing-section";
import { FsrsOptimizationSection } from "@/features/settings/components/fsrs/fsrs-optimization-section";
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
        <FsrsFuzzingSection />

        <Separator />

        <FsrsOptimizationSection />
      </CardContent>
    </Card>
  );
};
