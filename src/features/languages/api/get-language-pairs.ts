import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { languagePairSchema } from "@/features/languages/types";
import { apiClient } from "@/lib/api-client";

export const useLanguagePairs = () =>
  useQuery({
    queryKey: ["language-pairs"],
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>("/languages/pairs");
      return z.array(languagePairSchema).parse(data);
    },
  });
