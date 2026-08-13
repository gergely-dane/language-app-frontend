import { IconArrowNarrowDown, IconArrowNarrowUp } from "@tabler/icons-react";
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
      className="flex cursor-pointer items-center gap-1 text-xs font-medium tracking-wide uppercase hover:underline"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <p>{headerName}</p>
      {icon}
      {column.getIsSorted() === "asc" && <IconArrowNarrowUp size={14} />}
      {column.getIsSorted() === "desc" && <IconArrowNarrowDown size={14} />}
    </div>
  );
};
