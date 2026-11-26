import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  PAGINATION_SIBLINGS_DESKTOP,
  PAGINATION_SIBLINGS_MOBILE,
} from "@/features/vocabulary/constants";
import { getPaginationItems } from "@/features/vocabulary/utils";
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
  const items = getPaginationItems(
    currentPage,
    totalPages,
    isMobile ? PAGINATION_SIBLINGS_MOBILE : PAGINATION_SIBLINGS_DESKTOP,
  );

  return (
    <Pagination className={className}>
      <PaginationContent className="max-sm:gap-0.5">
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage <= 1}
            onClick={() => onChange(currentPage - 1)}
          />
        </PaginationItem>

        {items.map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink
                isActive={currentPage === item}
                onClick={() => onChange(item)}
              >
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis className="max-sm:w-6" />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            disabled={currentPage >= totalPages}
            onClick={() => onChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
