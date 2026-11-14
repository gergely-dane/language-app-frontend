"use client";

import {
  arrow,
  autoUpdate,
  type ElementProps,
  flip,
  FloatingArrow,
  type FloatingContext,
  FloatingPortal,
  NextFloatingDelayGroup,
  offset,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useNextDelayGroup,
  useRole,
} from "@floating-ui/react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";

type SlideOffset = { x: number; y: number };

type TooltipAnimation = {
  slideOffset: SlideOffset;
  isInstant: boolean;
};

type TooltipTriggerProps = {
  ref?: React.Ref<Element>;
  className?: string;
};

type TooltipProps = {
  content: React.ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  className?: string;
  children: React.ReactElement<TooltipTriggerProps>;
};

const TOOLTIP_DELAY = { open: 300, close: 100 };
const TOOLTIP_GROUP_TIMEOUT_MS = 300;
const TOOLTIP_OFFSET = 8;
const TOOLTIP_VIEWPORT_PADDING = 8;
const TOOLTIP_SLIDE_DISTANCE = 4;
const TOOLTIP_TRANSITION = { duration: 0.12, ease: "easeOut" } as const;
const TOOLTIP_ARROW_FILL = "var(--color-background)";
// Same color as the border-border/50 class on the tooltip.
const TOOLTIP_ARROW_STROKE =
  "color-mix(in oklab, var(--color-border) 50%, transparent)";
const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 10;
const SUPPRESSED_CLICK_WINDOW_MS = 400;
const INTERACTIVE_TRIGGER_SELECTOR =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [role="button"], [role="tab"], [role="link"], [role="checkbox"], [role="switch"]';

const NO_SLIDE_OFFSET: SlideOffset = { x: 0, y: 0 };

const SLIDE_OFFSETS: Record<TooltipSide, SlideOffset> = {
  top: { x: 0, y: TOOLTIP_SLIDE_DISTANCE },
  bottom: { x: 0, y: -TOOLTIP_SLIDE_DISTANCE },
  left: { x: TOOLTIP_SLIDE_DISTANCE, y: 0 },
  right: { x: -TOOLTIP_SLIDE_DISTANCE, y: 0 },
};

// Read through AnimatePresence's custom so an exiting tooltip picks up the instant phase set in the same render that removes it.
const TOOLTIP_VARIANTS = {
  hidden: ({ slideOffset, isInstant }: TooltipAnimation) => ({
    opacity: 0,
    ...slideOffset,
    transition: isInstant ? { duration: 0 } : TOOLTIP_TRANSITION,
  }),
  visible: ({ isInstant }: TooltipAnimation) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: isInstant ? { duration: 0 } : TOOLTIP_TRANSITION,
  }),
} satisfies Variants;

const getPlacement = (side: TooltipSide, align: TooltipAlign): Placement =>
  align === "center" ? side : `${side}-${align}`;

const getSide = (placement: Placement) =>
  placement.split("-")[0] as TooltipSide;

// Touch screens have no hover: a long-press opens the tooltip on any trigger without firing its action, a tap opens it on non-interactive triggers.
const useTouchOpen = (context: FloatingContext): ElementProps => {
  const { open } = context;
  const pressTimeoutRef = React.useRef(-1);
  const pressStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = React.useRef(false);

  const cancelPress = React.useCallback(() => {
    window.clearTimeout(pressTimeoutRef.current);
    pressStartRef.current = null;
  }, []);

  React.useEffect(() => cancelPress, [cancelPress]);

  const reference = React.useMemo<ElementProps["reference"]>(() => {
    const suppressClick = (event: React.SyntheticEvent) => {
      if (!suppressClickRef.current) return;

      event.preventDefault();
      event.stopPropagation();
    };

    return {
      onPointerDown: (event) => {
        if (event.pointerType !== "touch") return;

        const nativeEvent = event.nativeEvent;
        suppressClickRef.current = false;
        pressStartRef.current = { x: event.clientX, y: event.clientY };
        pressTimeoutRef.current = window.setTimeout(() => {
          pressStartRef.current = null;
          suppressClickRef.current = true;
          context.onOpenChange(true, nativeEvent);
        }, LONG_PRESS_MS);
      },
      onPointerMove: (event) => {
        const start = pressStartRef.current;
        if (!start) return;

        const distance = Math.hypot(
          event.clientX - start.x,
          event.clientY - start.y,
        );
        if (distance > LONG_PRESS_MOVE_TOLERANCE) cancelPress();
      },
      onPointerUp: (event) => {
        if (event.pointerType !== "touch") return;

        const isTap = pressStartRef.current !== null;
        cancelPress();

        if (suppressClickRef.current) {
          window.setTimeout(() => {
            suppressClickRef.current = false;
          }, SUPPRESSED_CLICK_WINDOW_MS);
          return;
        }

        if (
          isTap &&
          !event.currentTarget.matches(INTERACTIVE_TRIGGER_SELECTOR)
        ) {
          context.onOpenChange(!open, event.nativeEvent);
        }
      },
      onPointerCancel: cancelPress,
      onContextMenu: (event) => {
        if (pressStartRef.current || suppressClickRef.current) {
          event.preventDefault();
        }
      },
      onMouseDownCapture: suppressClick,
      onClickCapture: suppressClick,
    };
  }, [cancelPress, context, open]);

  return React.useMemo(() => ({ reference }), [reference]);
};

const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <NextFloatingDelayGroup
    delay={TOOLTIP_DELAY}
    timeoutMs={TOOLTIP_GROUP_TIMEOUT_MS}
  >
    {children}
  </NextFloatingDelayGroup>
);

const Tooltip = ({
  content,
  side = "top",
  align = "center",
  className,
  children,
}: TooltipProps) => {
  const [open, setOpen] = React.useState(false);
  const [arrowElement, setArrowElement] = React.useState<SVGSVGElement | null>(
    null,
  );
  const isReducedMotion = useReducedMotion();

  const { refs, floatingStyles, context, placement } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: getPlacement(side, align),
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(TOOLTIP_OFFSET),
      flip({ padding: TOOLTIP_VIEWPORT_PADDING }),
      shift({ padding: TOOLTIP_VIEWPORT_PADDING }),
      arrow({ element: arrowElement, padding: TOOLTIP_VIEWPORT_PADDING }),
    ],
  });

  const setTriggerElement = React.useCallback(
    (node: Element | null) => refs.setReference(node),
    [refs],
  );
  const setTooltipElement = React.useCallback(
    (node: HTMLElement | null) => refs.setFloating(node),
    [refs],
  );

  const { delayRef, isInstantPhase, hasProvider } = useNextDelayGroup(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      mouseOnly: true,
      move: false,
      delay: () => (hasProvider ? delayRef.current : TOOLTIP_DELAY),
    }),
    useFocus(context),
    useDismiss(context, { ancestorScroll: true }),
    useRole(context, { role: "tooltip" }),
    useTouchOpen(context),
  ]);

  const triggerRef = useMergeRefs([setTriggerElement, children.props.ref]);
  const animation: TooltipAnimation = {
    slideOffset: isReducedMotion
      ? NO_SLIDE_OFFSET
      : SLIDE_OFFSETS[getSide(placement)],
    isInstant: isInstantPhase,
  };

  return (
    <>
      {React.cloneElement(children, {
        ...getReferenceProps({
          ...children.props,
          className: cn(
            children.props.className,
            "select-none [-webkit-touch-callout:none]",
          ),
        }),
        ref: triggerRef,
      })}

      <AnimatePresence custom={animation}>
        {open && (
          <FloatingPortal key="tooltip">
            <motion.div
              ref={setTooltipElement}
              data-slot="tooltip-content"
              className={cn(
                "border-border/50 bg-background text-foreground pointer-events-none z-50 w-max max-w-xs rounded-lg border px-2.5 py-1.5 text-xs text-balance shadow-xl",
                className,
              )}
              style={floatingStyles}
              custom={animation}
              variants={TOOLTIP_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="hidden"
              {...getFloatingProps()}
            >
              {content}

              <FloatingArrow
                ref={setArrowElement}
                context={context}
                width={12}
                height={6}
                fill={TOOLTIP_ARROW_FILL}
                stroke={TOOLTIP_ARROW_STROKE}
                strokeWidth={1}
              />
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
};

export { Tooltip, TooltipProvider };
