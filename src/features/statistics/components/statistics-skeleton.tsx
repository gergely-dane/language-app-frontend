import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatisticsSkeletonProps = {
  className?: string;
};

export const StatisticsSkeleton = ({ className }: StatisticsSkeletonProps) => {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>

      <Skeleton className="hidden h-[210px] w-full rounded-lg md:block" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-lg lg:h-[280px]" />
        <Skeleton className="h-[300px] rounded-lg lg:h-[280px]" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-lg lg:h-[280px]" />
        <Skeleton className="h-[400px] rounded-lg lg:h-[280px]" />
      </div>
    </div>
  );
};
