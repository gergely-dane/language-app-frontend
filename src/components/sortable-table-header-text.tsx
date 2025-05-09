import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsSort,
} from "@tabler/icons-react";

export function SortableTableHeaderText({ headerName, column }) {
  return (
    <div
      className="flex cursor-pointer hover:underline"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {headerName}
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
