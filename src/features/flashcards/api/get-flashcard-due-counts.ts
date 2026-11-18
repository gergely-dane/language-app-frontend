import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

import { flashcardDueCountSchema } from "../types";

export const useFlashcardDueCounts = (isReverse: boolean) =>
  useQuery({
    queryKey: ["flashcards", "due-counts", isReverse],
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>("/flashcards/due-counts", {
        params: { isReverse },
      });
      return z.array(flashcardDueCountSchema).parse(data);
    },
  });
