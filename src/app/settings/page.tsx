import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { SettingsPage } from "@/app/settings/_components/settings-page";
import { getUserQueryOptions } from "@/features/user/api/get-user";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getUserQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsPage />
    </HydrationBoundary>
  );
}
