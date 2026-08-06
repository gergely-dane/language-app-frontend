import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { SettingsPage } from "@/app/settings/_components/settings-page";
import { getFsrsOptimizationStatusQueryOptions } from "@/features/user/api/get-fsrs-optimization-status";
import { getUserQueryOptions } from "@/features/user/api/get-user";

export default async function Page() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getUserQueryOptions()),
    queryClient.prefetchQuery(getFsrsOptimizationStatusQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsPage />
    </HydrationBoundary>
  );
}
