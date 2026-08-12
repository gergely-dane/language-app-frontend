"use client";

import { PageHeader } from "@/components/common/page-header";
import { StatisticsOverview } from "@/features/statistics/components/statistics-overview";
import { useGetUser } from "@/features/user/api/get-user";
import { useI18n } from "@/hooks/use-i18n";

export const HomePage = () => {
  const t = useI18n();
  const { data: user } = useGetUser();

  const hour = new Date().getHours();
  const greeting =
    hour < 5
      ? t("general.upLate")
      : hour < 12
        ? t("general.goodMorning")
        : hour < 18
          ? t("general.goodAfternoon")
          : t("general.goodEvening");

  return (
    <div className="min-h-[calc(100vh-var(--navbar-height))] w-full">
      <PageHeader
        title={
          <>
            {greeting}
            {user?.firstName ? `, ${user.firstName}` : ""}.
          </>
        }
        subtitle={t("general.heresSomeInfo")}
      />

      <StatisticsOverview className="mt-6" />
    </div>
  );
};
