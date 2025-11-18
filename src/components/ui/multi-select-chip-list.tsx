import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

type MultiSelectChipListProps = {
  className?: string;
  items: string[];
  onChange?: (items: string[]) => void;
};

export const MultiSelectChipList = ({
  className,
  items,
  onChange,
}: MultiSelectChipListProps) => {
  if (!items?.length) {
    return;
  }

  const handleRemoveItem = (itemToRemove: string) => {
    if (onChange) {
      onChange(items.filter((item) => item !== itemToRemove));
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item, index) => (
        <Badge key={index} className="py-1">
          <p>{item}</p>
          <div
            onClick={() => handleRemoveItem(item)}
            className="flex cursor-pointer h-full w-3.5"
          >
            <IconX className="m-auto" size={12} />
          </div>
        </Badge>
      ))}
    </div>
  );
};
