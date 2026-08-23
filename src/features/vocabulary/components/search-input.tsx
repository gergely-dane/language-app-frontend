import { IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchInput = ({
  className,
  value,
  onChange,
  placeholder,
  disabled,
}: SearchInputProps) => {
  const t = useI18n();

  return (
    <div className={cn("relative", className)}>
      <Input
        className="pr-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />

      {value && (
        <Button
          className="absolute top-0 right-0 opacity-50 hover:opacity-100"
          variant={null}
          size="icon"
          onClick={() => onChange("")}
          aria-label={t("vocabulary.clearFilter")}
          disabled={disabled}
        >
          <IconX />
        </Button>
      )}
    </div>
  );
};
