import { IconX } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  className?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchInput = ({
  className,
  onSearch,
  placeholder,
  disabled,
}: SearchInputProps) => {
  const t = useI18n();
  const [value, setValue] = useState("");
  const debouncedSearch = useDebouncedCallback(onSearch);

  const onInputChange = (newValue: string) => {
    setValue(newValue);
    debouncedSearch.run(newValue);
  };

  const onClear = () => {
    setValue("");
    debouncedSearch.cancel();
    onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        className="pr-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={disabled}
      />

      {value && (
        <Button
          className="absolute top-0 right-0 opacity-50 hover:opacity-100"
          variant={null}
          size="icon"
          onClick={onClear}
          aria-label={t("vocabulary.clearFilter")}
          disabled={disabled}
        >
          <IconX />
        </Button>
      )}
    </div>
  );
};
