"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserSettingSwitch } from "@/features/settings/components/user-setting-switch";
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

      <CardContent>
        <UserSettingSwitch
          setting="showNativeLanguageNames"
          title={t("settings.nativeLanguageNamesTitle")}
          description={t("settings.nativeLanguageNamesDescription")}
          enabledMessage={t("settings.nativeLanguageNamesEnabled")}
          disabledMessage={t("settings.nativeLanguageNamesDisabled")}
        />
      </CardContent>
    </Card>
  );
};
