"use client";

import { StatisticsDisplay } from "@/features/statistics/components/statistics-display";
import { useI18n } from "@/hooks/use-i18n";

export const HomePage = () => {
  const t = useI18n();

  return (
    <div className="min-h-[calc(100vh-var(--navbar-height))] w-full">
      <p className="text-3xl font-bold">{t("general.welcomeBack")}</p>

      <p className="text-muted-foreground font-semibold">
        {t("general.heresSomeInfo")}
      </p>

      <StatisticsDisplay className="mt-6" />
    </div>
  );
};
