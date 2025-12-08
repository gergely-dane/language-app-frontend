import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { IconX } from "@tabler/icons-react";

interface SearchInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  className,
  value,
  onChange,
  placeholder,
}: SearchInputProps) => (
  <div className={cn("relative", className)}>
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />

    {value && (
      <Button
        className="absolute right-0 top-0 opacity-50 hover:opacity-100"
        variant={null}
        size="icon"
        onClick={() => onChange("")}
        aria-label="Clear filter"
      >
        <IconX />
      </Button>
    )}
  </div>
);
