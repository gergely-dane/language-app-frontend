import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsSort,
} from "@tabler/icons-react";
import { type Column } from "@tanstack/table-core";
import React from "react";

type SortableTableHeaderTextProps = {
  headerName?: string;
  icon?: React.ReactNode;
  column: Column<any>;
};

export const SortableTableHeaderText = ({
  headerName,
  icon,
  column,
}: SortableTableHeaderTextProps) => {
  return (
    <div
      className="flex cursor-pointer gap-1 hover:underline"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <p>{headerName}</p>
      {icon}
      <span className="mt-0.5">
        {column.getIsSorted() === "asc" ? (
          <IconArrowNarrowUp size={16} />
        ) : column.getIsSorted() === "desc" ? (
          <IconArrowNarrowDown size={16} />
        ) : (
          <IconArrowsSort size={16} />
        )}
      </span>
    </div>
  );
};
