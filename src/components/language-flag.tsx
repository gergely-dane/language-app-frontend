import Flag from "react-flagpack";

export default function LanguageFlag({ language }: { language: string }) {
  language = language == "en" ? "gb-ukm" : language;

  return <Flag code={language} size="m" hasDropShadow className="mt-1" />;
}
