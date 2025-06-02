import Flag from "react-flagpack";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { LanguagePair } from "@/app/vocabulary/columns";

export default function LanguagePairFlags({
  sourceLanguage,
  translationLanguage,
  iconMargin = false,
}: LanguagePair & { iconMargin?: boolean }) {
  sourceLanguage = sourceLanguage == "en" ? "gb-ukm" : sourceLanguage;
  translationLanguage =
    translationLanguage == "en" ? "gb-ukm" : translationLanguage;
  return (
    <div className="flex gap-1">
      <Flag code={sourceLanguage} size="m" hasDropShadow className="mt-1" />
      <IconArrowNarrowRight className={iconMargin && "mt-1"} />
      <Flag
        code={translationLanguage}
        size="m"
        hasDropShadow
        className="mt-1"
      />
    </div>
  );
}
