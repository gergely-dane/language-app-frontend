"use client";

import {
  IconAlertTriangle,
  IconCalendarCheck,
  IconCards,
  IconCircleCheck,
  IconClock,
  IconSparkles,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormatter } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAlert } from "@/context/alert-context";
import { useGetFsrsOptimizationStatus } from "@/features/settings/api/get-fsrs-optimization-status";
import { useOptimizeFsrs } from "@/features/settings/api/optimize-fsrs";
import { useResetFsrsWeights } from "@/features/settings/api/reset-fsrs-weights";
import { OptimizeConfirmationDialog } from "@/features/settings/components/fsrs/optimize-confirmation-dialog";
import { ResetConfirmationDialog } from "@/features/settings/components/fsrs/reset-confirmation-dialog";
import {
  FSRS_OPTIMIZATION_STATE,
  type FsrsOptimizationState,
} from "@/features/settings/constants";
import { isFsrsOptimizationInProgress } from "@/features/settings/utils";
import { useI18n } from "@/hooks/use-i18n";

export const FsrsOptimizationSection = () => {
  const t = useI18n();
  const format = useFormatter();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  const {
    data: status,
    isLoading,
    isError,
    refetch,
  } = useGetFsrsOptimizationStatus();

  const optimizeFsrs = useOptimizeFsrs();
  const resetFsrsWeights = useResetFsrsWeights();

  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetCooldownHours, setResetCooldownHours] = useState<number | null>(
    null,
  );

  const previousState = useRef<FsrsOptimizationState | undefined>(
    status?.state,
  );

  useEffect(() => {
    const previous = previousState.current;
    previousState.current = status?.state;

    if (
      previous === undefined ||
      status === undefined ||
      previous === status.state
    ) {
      return;
    }

    const wasRunning =
      previous === FSRS_OPTIMIZATION_STATE.Pending ||
      previous === FSRS_OPTIMIZATION_STATE.Running;
    if (!wasRunning) return;

    if (status.state === FSRS_OPTIMIZATION_STATE.Completed) {
      showAlert({ title: t("settings.optimizeSuccess"), variant: "default" });
      // Card scheduling intervals derive from the weights.
      void queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    }

    if (status.state === FSRS_OPTIMIZATION_STATE.Failed) {
      showAlert({ title: t("settings.optimizeError"), variant: "destructive" });
    }
  }, [status, showAlert, queryClient, t]);

  const handleOptimize = async () => {
    try {
      await optimizeFsrs.mutateAsync();
      setIsOptimizeDialogOpen(false);
      showAlert({ title: t("settings.optimizeQueued"), variant: "default" });
    } catch {
      showAlert({ title: t("settings.optimizeError"), variant: "destructive" });
    }
  };

  const handleReset = async () => {
    try {
      await resetFsrsWeights.mutateAsync();
      setIsResetDialogOpen(false);
      showAlert({ title: t("settings.resetSuccess"), variant: "default" });
    } catch {
      showAlert({ title: t("settings.resetError"), variant: "destructive" });
    }
  };

  const formatCount = (count: number) => format.number(count);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <Skeleton className="h-5 w-44" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-9 w-28" />
      </section>
    );
  }

  if (isError || !status) {
    return (
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">
          {t("settings.optimizationTitle")}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t("settings.statusLoadError")}
        </p>
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => void refetch()}
        >
          {t("settings.retry")}
        </Button>
      </section>
    );
  }

  const isInProgress = isFsrsOptimizationInProgress(status);
  const hasFailed = status.state === FSRS_OPTIMIZATION_STATE.Failed;
  const optimizeLabel = status.isOptimized
    ? t("settings.reOptimize")
    : t("settings.optimize");
  const requiredLabel = formatCount(status.minimumReviewsRequired);
  const progressHelper = status.isOptimized
    ? t("settings.reviewProgressSinceHelper", { required: requiredLabel })
    : t("settings.reviewProgressHelper", { required: requiredLabel });
  const progressPercent = Math.min(
    100,
    Math.round(
      (status.reviewsSinceLastOptimization / status.minimumReviewsRequired) *
        100,
    ),
  );
  const hasEnoughReviews =
    status.reviewsSinceLastOptimization >= status.minimumReviewsRequired;
  const cooldownEndsAt =
    status.nextOptimizationAvailableAt != null && hasEnoughReviews
      ? new Date(status.nextOptimizationAvailableAt)
      : null;
  const isOnCooldown = cooldownEndsAt != null && !isInProgress;
  const openResetDialog = () => {
    setResetCooldownHours(
      status.nextOptimizationAvailableAt
        ? Math.max(
            1,
            Math.ceil(
              (new Date(status.nextOptimizationAvailableAt).getTime() -
                Date.now()) /
                3_600_000,
            ),
          )
        : null,
    );
    setIsResetDialogOpen(true);
  };
  const cooldownHelper = isOnCooldown
    ? t("settings.cooldownHelper", {
        time: format.relativeTime(cooldownEndsAt),
      })
    : null;

  const statusBadge = isInProgress ? (
    <Badge variant="secondary">
      <Spinner className="text-current" />
      {t("settings.statusOptimizing")}
    </Badge>
  ) : hasFailed ? (
    <Badge variant="destructive">
      <IconAlertTriangle />
      {t("settings.statusFailed")}
    </Badge>
  ) : status.isOptimized ? (
    <Badge variant="outline" className="text-emerald-500">
      <IconCircleCheck />
      {t("settings.statusOptimized")}
    </Badge>
  ) : (
    <Badge variant="secondary">{t("settings.statusNotOptimized")}</Badge>
  );

  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">
              {t("settings.optimizationTitle")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("settings.optimizationDescription")}
            </p>
          </div>
          {statusBadge}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <IconCards className="text-primary size-4" />
              <p className="text-muted-foreground text-sm font-medium">
                {t("settings.totalReviews")}
              </p>
            </div>
            <p className="text-xl font-bold">
              {formatCount(status.totalReviews)}
            </p>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <IconCalendarCheck className="size-4 text-sky-500" />
              <p className="text-muted-foreground text-sm font-medium">
                {t("settings.lastOptimized")}
              </p>
            </div>
            {status.lastOptimizedAt ? (
              <>
                <p className="text-xl font-bold">
                  {format.dateTime(new Date(status.lastOptimizedAt), {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {status.reviewsUsedForOptimization != null && (
                  <p className="text-muted-foreground text-xs">
                    {t("settings.optimizedWithReviews", {
                      count: formatCount(status.reviewsUsedForOptimization),
                    })}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-xl font-bold">
                {t("settings.neverOptimized")}
              </p>
            )}
          </div>
        </div>

        {hasFailed && (
          <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-3">
            <p className="text-destructive text-sm font-medium">
              {t("settings.optimizeError")}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("settings.optimizeErrorHelper")}
            </p>
          </div>
        )}

        {isOnCooldown && cooldownHelper && (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <IconClock className="text-muted-foreground size-5 shrink-0" />
            <p className="text-muted-foreground text-sm">{cooldownHelper}</p>
          </div>
        )}

        {!status.canOptimize && !isOnCooldown && (
          <div className="flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <p className="text-muted-foreground">{progressHelper}</p>
              <p className="font-medium text-nowrap">
                {t("settings.reviewProgress", {
                  count: formatCount(status.reviewsSinceLastOptimization),
                  required: requiredLabel,
                })}
              </p>
            </div>

            <div
              className="bg-muted h-2 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={status.minimumReviewsRequired}
              aria-valuenow={status.reviewsSinceLastOptimization}
            >
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {isInProgress && (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Spinner className="size-5 shrink-0" />
            <div className="flex flex-col gap-0.5 text-sm">
              <p className="font-medium">{t("settings.optimizeInProgress")}</p>
              <p className="text-muted-foreground">
                {t("settings.optimizeInProgressHelper")}
              </p>
            </div>
          </div>
        )}

        {status.canOptimize && !status.isOptimized && !isInProgress && (
          <div className="border-primary/30 bg-primary/10 flex items-center gap-3 rounded-lg border p-3">
            <IconSparkles className="text-primary size-5 shrink-0" />
            <p className="text-sm font-medium">
              {t("settings.optimizationAvailable")}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {status.canOptimize ? (
            <Button
              onClick={() => setIsOptimizeDialogOpen(true)}
              disabled={isInProgress}
              isLoading={isInProgress}
            >
              {optimizeLabel}
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block cursor-not-allowed">
                  <Button disabled>{optimizeLabel}</Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {cooldownHelper ?? progressHelper}
              </TooltipContent>
            </Tooltip>
          )}

          {status.isOptimized && (
            <Button
              variant="outline"
              onClick={openResetDialog}
              disabled={isInProgress}
            >
              {t("settings.resetWeights")}
            </Button>
          )}
        </div>
      </section>

      <OptimizeConfirmationDialog
        open={isOptimizeDialogOpen}
        onOpenChange={setIsOptimizeDialogOpen}
        onConfirm={() => {
          void handleOptimize();
        }}
        isLoading={optimizeFsrs.isPending}
        reviewCount={status.totalReviews}
      />

      <ResetConfirmationDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onConfirm={() => {
          void handleReset();
        }}
        isLoading={resetFsrsWeights.isPending}
        cooldownHours={resetCooldownHours}
      />
    </>
  );
};
