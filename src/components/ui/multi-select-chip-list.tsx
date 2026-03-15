import { IconX } from "@tabler/icons-react";
import { type MouseEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

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
          className="cursor-pointer py-1"
          onClick={() => onItemClick?.(item)}
        >
          <p>{item}</p>

          <button
            onClick={(e) => handleRemoveItem(e, item)}
            className="flex h-full w-3.5 cursor-pointer"
          >
            <IconX className="m-auto" size={12} />
          </button>
        </Badge>
      ))}
    </div>
  );
};
