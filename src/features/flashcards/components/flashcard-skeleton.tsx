import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type FlashcardSkeletonProps = {
  className?: string;
};

export const FlashcardSkeleton = ({ className }: FlashcardSkeletonProps) => (
  <Skeleton className={cn("h-62 rounded-xl md:h-74 lg:h-84", className)} />
);

export const FlashcardResponseButtonsSkeleton = ({
  className,
}: FlashcardSkeletonProps) => (
  <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-16 rounded-xl" />
    ))}
  </div>
);
