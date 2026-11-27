"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

type UserSettingLoadErrorProps = {
  title: string;
  onRetry: () => void;
};

export const UserSettingLoadError = ({
  title,
  onRetry,
}: UserSettingLoadErrorProps) => {
  const t = useI18n();

  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-sans text-sm font-semibold tracking-normal">
        {title}
      </h3>

      <p className="text-muted-foreground text-sm">
        {t("settings.settingsLoadError")}
      </p>

      <Button variant="outline" className="w-fit" onClick={onRetry}>
        {t("settings.retry")}
      </Button>
    </section>
  );
};
