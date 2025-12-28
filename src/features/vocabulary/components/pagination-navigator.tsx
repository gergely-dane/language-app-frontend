import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  let firstNumber: number;

  if (currentPage < 2) {
    firstNumber = 1;
  } else if (currentPage < totalPages - 3) {
    firstNumber = currentPage - 1;
  } else {
    firstNumber = Math.max(totalPages - 4, 1);
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem className={currentPage === 1 ? "invisible" : ""}>
          <PaginationPrevious
            onClick={() => (currentPage > 1 ? onChange(currentPage - 1) : 1)}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive={currentPage === firstNumber}
            onClick={() => onChange(firstNumber)}
          >
            {firstNumber}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive={currentPage === firstNumber + 1}
            onClick={() => onChange(firstNumber + 1)}
          >
            {firstNumber + 1}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive={currentPage === firstNumber + 2}
            onClick={() => onChange(firstNumber + 2)}
          >
            {firstNumber + 2}
          </PaginationLink>
        </PaginationItem>

        {currentPage < totalPages - 3 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === totalPages - 1}
              onClick={() => onChange(totalPages - 1)}
            >
              {totalPages - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => onChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem
          className={currentPage === totalPages ? "invisible" : ""}
        >
          <PaginationNext
            onClick={() =>
              currentPage < totalPages ? onChange(currentPage + 1) : totalPages
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
