import { type FsrsOptimizationState } from "@/features/user/constants";

export interface FsrsOptimizationStatus {
  totalReviews: number;
  reviewsSinceLastOptimization: number;
  canOptimize: boolean;
  minimumReviewsRequired: number;
  state: FsrsOptimizationState;
  isOptimized: boolean;
  lastOptimizedAt: string | null;
  reviewsUsedForOptimization: number | null;
  queuedAt: string | null;
  failureReason: string | null;
}
