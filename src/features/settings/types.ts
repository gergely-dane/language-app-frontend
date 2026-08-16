import { z } from "zod";

import { FSRS_OPTIMIZATION_STATE } from "@/features/settings/constants";

export const fsrsOptimizationStatusSchema = z.object({
  totalReviews: z.number(),
  reviewsSinceLastOptimization: z.number(),
  canOptimize: z.boolean(),
  minimumReviewsRequired: z.number(),
  state: z.enum(FSRS_OPTIMIZATION_STATE),
  isOptimized: z.boolean(),
  lastOptimizedAt: z.string().nullable(),
  nextOptimizationAvailableAt: z.string().nullable(),
  reviewsUsedForOptimization: z.number().nullable(),
  queuedAt: z.string().nullable(),
  failureReason: z.string().nullable(),
});

export type FsrsOptimizationStatus = z.infer<
  typeof fsrsOptimizationStatusSchema
>;
