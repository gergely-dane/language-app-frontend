import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsSort,
} from "@tabler/icons-react";
import { Column } from "@tanstack/table-core";
import React from "react";

interface SortableTableHeaderTextProps {
  headerName?: string;
  icon?: React.ReactNode;
  column: Column<any>;
}

export function SortableTableHeaderText({
  headerName,
  icon,
  column,
}: SortableTableHeaderTextProps) {
  return (
    <div
      className="flex cursor-pointer hover:underline"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {headerName}
      {icon}
      {column.getIsSorted() === "asc" ? (
        <span>
          {" "}
          <IconArrowNarrowUp className="mt-0.5 ml-1" size={16} />{" "}
        </span>
      ) : column.getIsSorted() === "desc" ? (
        <span>
          {" "}
          <IconArrowNarrowDown className="mt-0.5 ml-1" size={16} />{" "}
        </span>
      ) : (
        <span>
          {" "}
          <IconArrowsSort className="mt-0.5 ml-1" size={16} />{" "}
        </span>
      )}
    </div>
  );
}
