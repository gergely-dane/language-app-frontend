import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { IconX } from "@tabler/icons-react";
import { MouseEvent } from "react";

type MultiSelectChipListProps = {
  className?: string;
  items: string[];
  onChange?: (items: string[]) => void;
  onItemClick?: (item: string) => void;
};

export const MultiSelectChipList = ({
  className,
  items,
  onChange,
  onItemClick,
}: MultiSelectChipListProps) => {
  if (!items?.length) {
    return;
  }

  const handleRemoveItem = (e: MouseEvent, itemToRemove: string) => {
    e.stopPropagation();

    if (onChange) {
      onChange(items.filter((item) => item !== itemToRemove));
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item, index) => (
        <Badge
          key={index}
          className="py-1 cursor-pointer"
          onClick={() => onItemClick?.(item)}
        >
          <p>{item}</p>
          <div
            onClick={(e) => handleRemoveItem(e, item)}
            className="flex cursor-pointer h-full w-3.5"
          >
            <IconX className="m-auto" size={12} />
          </div>
        </Badge>
      ))}
    </div>
  );
};
