import React from "react";

import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";

import { MINUTES_IN_DAY } from "../constants";

type ReviewTimeDisplayProps = {
  minutes: number;
} & React.HTMLAttributes<HTMLParagraphElement>;

const ReviewTimeDisplay: React.FC<ReviewTimeDisplayProps> = ({
  minutes,
  className,
  ...props
}) => {
  const t = useI18n();

  if (minutes >= MINUTES_IN_DAY * 365) {
    const years = Number((minutes / (MINUTES_IN_DAY * 365)).toFixed(1));

    return (
      <p className={cn("text-muted-foreground text-sm", className)} {...props}>
        +<span>{years}</span>{" "}
        {years === 1 ? t("flashcards.year") : t("flashcards.years")}
      </p>
    );
  }

  if (minutes >= MINUTES_IN_DAY * 30) {
    const months = Number((minutes / (MINUTES_IN_DAY * 30)).toFixed(1));

    return (
      <p className={cn("text-muted-foreground text-sm", className)} {...props}>
        +<span>{months}</span>{" "}
        {months === 1 ? t("flashcards.month") : t("flashcards.months")}
      </p>
    );
  }

  if (minutes >= MINUTES_IN_DAY) {
    const days = Math.round(minutes / MINUTES_IN_DAY);

    return (
      <p className={cn("text-muted-foreground text-sm", className)} {...props}>
        +<span>{days}</span>{" "}
        {days === 1 ? t("flashcards.day") : t("flashcards.days")}
      </p>
    );
  }

  if (minutes >= 60) {
    const hours = Math.round(minutes / 60);

    return (
      <p className={cn("text-muted-foreground text-sm", className)} {...props}>
        +<span>{hours}</span>{" "}
        {hours === 1 ? t("flashcards.hour") : t("flashcards.hours")}
      </p>
    );
  }

  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props}>
      +<span>{minutes}</span>{" "}
      {minutes === 1 ? t("flashcards.minute") : t("flashcards.minutes")}
    </p>
  );
};

export default ReviewTimeDisplay;
