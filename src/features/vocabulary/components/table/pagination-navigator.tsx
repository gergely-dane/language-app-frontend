import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

type PaginationNavigatorProps = {
  className?: string;
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export const PaginationNavigator = ({
  className,
  currentPage,
  totalPages,
  onChange,
}: PaginationNavigatorProps) => {
  const isMobile = useIsMobileScreen();
  const siblings = isMobile ? 1 : 2;
  const visiblePages = siblings * 2 + 1;

  let startPage = Math.max(1, currentPage - siblings);
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);
  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  if (totalPages === 0) {
    startPage = 1;
    endPage = 0;
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            disabled={currentPage <= 1}
            onClick={() => onChange(1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage <= 1}
            onClick={() => onChange(currentPage - 1)}
          />
        </PaginationItem>

        {startPage > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={currentPage === page}
              onClick={() => onChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage > 0 && endPage < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => onChange(currentPage + 1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => onChange(totalPages > 0 ? totalPages : 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
