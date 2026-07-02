import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
} from "@tabler/icons-react";
import * as React from "react";

import { type Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/utils/cn";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      disabled={disabled}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function PaginationFirst({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const t = useI18n();

  return (
    <PaginationLink
      aria-label="Go to first page"
      size="default"
      className={cn(
        "gap-1 px-2.5 select-none sm:pl-2.5",
        buttonVariants({
          variant: "outline",
        }),
        className,
      )}
      {...props}
    >
      <IconChevronsLeft className="mt-0.5" />
      <span className="hidden sm:block">
        {t("vocabulary.first" as any) || "First"}
      </span>
    </PaginationLink>
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const t = useI18n();

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(
        "gap-1 px-2.5 select-none sm:pl-2.5",
        buttonVariants({
          variant: "outline",
        }),
        className,
      )}
      {...props}
    >
      <IconChevronLeft className="mt-0.5" />
      <span className="hidden sm:block">{t("vocabulary.previous")}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const t = useI18n();

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(
        "gap-1 px-2.5 select-none sm:pr-2.5",
        buttonVariants({
          variant: "outline",
        }),
        className,
      )}
      {...props}
    >
      <span className="hidden sm:block">{t("vocabulary.next")}</span>
      <IconChevronRight className="mt-0.5" />
    </PaginationLink>
  );
}

function PaginationLast({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const t = useI18n();

  return (
    <PaginationLink
      aria-label="Go to last page"
      size="default"
      className={cn(
        "gap-1 px-2.5 select-none sm:pr-2.5",
        buttonVariants({
          variant: "outline",
        }),
        className,
      )}
      {...props}
    >
      <span className="hidden sm:block">
        {t("vocabulary.last" as any) || "Last"}
      </span>
      <IconChevronsRight className="mt-0.5" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <IconDots className="size-4" />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
