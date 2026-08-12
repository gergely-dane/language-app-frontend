import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { StatisticsPage } from "@/app/statistics/_components/statistics-page";
import { getUserStatisticsQueryOptions } from "@/features/statistics/api/get-user-statistics";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    getUserStatisticsQueryOptions({ previousDays: 30 }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatisticsPage />
    </HydrationBoundary>
  );
}
