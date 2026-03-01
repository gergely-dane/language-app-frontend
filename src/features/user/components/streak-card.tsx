import { useI18n } from "@/hooks/use-i18n";
import { type UserStatistics } from "@/interfaces/user-statistics.interface";
import { cn } from "@/utils/cn";

type StreakCardProps = {
  stats: UserStatistics;
  className?: string;
};

export const StreakCard = ({ stats, className }: StreakCardProps) => {
  const t = useI18n();
  const days = stats?.total?.activityStreak ?? 0;

  return (
    <div
      className={cn(
        "bg-card flex flex-col justify-center gap-2 rounded-lg border p-8 shadow-sm",
        className,
      )}
    >
      <div>
        {days > 1 && (
          <p className="text-lg font-semibold">
            {t("statistics.streakCard.title")}
          </p>
        )}

        <p className="font-semibold">
          {days > 1 ? (
            <span className="text-primary text-3xl">
              {t("statistics.streakCard.streak", { days })}
            </span>
          ) : (
            <span className="text-2xl">
              {t("statistics.streakCard.dayOne")}
            </span>
          )}
        </p>
      </div>

      {days > 1 && (
        <p className="text-muted-foreground text-sm">
          {t("statistics.streakCard.keepGoing")}
        </p>
      )}
    </div>
  );
};
