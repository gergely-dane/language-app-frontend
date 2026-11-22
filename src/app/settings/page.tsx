import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { SettingsPage } from "@/app/settings/_components/settings-page";
import { getFsrsOptimizationStatusQueryOptions } from "@/features/settings/api/get-fsrs-optimization-status";
import { getUserSettingsQueryOptions } from "@/features/settings/api/get-user-settings";
import { getUserQueryOptions } from "@/features/user/api/get-user";

export default async function Page() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getUserQueryOptions()),
    queryClient.prefetchQuery(getFsrsOptimizationStatusQueryOptions()),
    queryClient.prefetchQuery(getUserSettingsQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsPage />
    </HydrationBoundary>
  );
}
