"use client";

import * as React from "react";

import { cn } from "@/utils/cn";

const Table = ({ className, ...props }: React.ComponentProps<"table">) => {
  return (
    <div
      className="border-muted relative w-full overflow-x-auto rounded-lg shadow-md border-1"
      data-slot="table-container"
    >
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
};

const TableHeader = ({
  className,
  ...props
}: React.ComponentProps<"thead">) => {
  return (
    <thead
      className={cn("h-8 select-none [&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
};

const TableBody = ({ className, ...props }: React.ComponentProps<"tbody">) => {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0 bg-card", className)}
      data-slot="table-body"
      {...props}
    />
  );
};

const TableFooter = ({
  className,
  ...props
}: React.ComponentProps<"tfoot">) => {
  return (
    <tfoot
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      data-slot="table-footer"
      {...props}
    />
  );
};

const TableRow = ({ className, ...props }: React.ComponentProps<"tr">) => {
  return (
    <tr
      className={cn(
        "hover:bg-accent data-[state=selected]:bg-muted border-muted border-b-1 transition-colors",
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
};

const TableHead = ({ className, ...props }: React.ComponentProps<"th">) => {
  return (
    <th
      className={cn(
        "text-foreground h-10 border-b-1 bg-primary text-primary-foreground px-2 text-left align-middle font-bold whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
};

const TableCell = ({ className, ...props }: React.ComponentProps<"td">) => {
  return (
    <td
      className={cn(
        "max-w-16 truncate p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
};

const TableCaption = ({
  className,
  ...props
}: React.ComponentProps<"caption">) => {
  return (
    <caption
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      data-slot="table-caption"
      {...props}
    />
  );
};

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
