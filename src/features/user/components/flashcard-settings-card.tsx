"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FsrsOptimizationSection } from "@/features/user/components/fsrs-optimization-section";
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
        <FsrsOptimizationSection />
      </CardContent>
    </Card>
  );
};
