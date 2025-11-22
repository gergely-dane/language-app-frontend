import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconX } from "@tabler/icons-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
}: SearchInputProps) => (
  <div className="relative">
    <Input
      className="mb-4 lg:w-50"
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
