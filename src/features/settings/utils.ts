import { FSRS_OPTIMIZATION_STATE } from "@/features/settings/constants";
import { type FsrsOptimizationStatus } from "@/features/settings/interfaces/fsrs-optimization.interface";

export const isFsrsOptimizationInProgress = (
  status: FsrsOptimizationStatus | undefined,
) =>
  status?.state === FSRS_OPTIMIZATION_STATE.Pending ||
  status?.state === FSRS_OPTIMIZATION_STATE.Running;
