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

  if (minutes >= MINUTES_IN_DAY) {
    const days = Math.floor(minutes / MINUTES_IN_DAY);

    return (
      <p className={cn("text-muted-foreground text-sm", className)} {...props}>
        +<span>{days}</span>{" "}
        {days === 1 ? t("flashcards.day") : t("flashcards.days")}
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
