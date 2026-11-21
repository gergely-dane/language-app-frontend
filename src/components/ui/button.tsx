"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type Transition } from "motion/react";
import * as React from "react";

import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex relative overflow-hidden items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 px-4 py-2 has-[>svg]:px-3 has-[[data-slot=button-content]>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 has-[[data-slot=button-content]>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 has-[[data-slot=button-content]>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const rippleVariants = cva("absolute rounded-full size-5 pointer-events-none", {
  variants: {
    variant: {
      default: "bg-primary",
      destructive: "bg-destructive",
      outline: "bg-primary",
      secondary: "bg-primary",
      ghost: "bg-primary",
      link: "bg-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type Ripple = { id: number; x: number; y: number; className: string };

const MotionButton: React.ElementType = motion.button;

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    ripple?: boolean;
    rippleClassName?: string;
    scale?: number;
    transition?: Transition;
    isLoading?: boolean;
  };

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ripple = false,
  rippleClassName,
  scale = 10,
  transition = { duration: 0.55, ease: "easeOut" },
  onPointerDown,
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (ripple && event.button === 0) {
      const rect = event.currentTarget.getBoundingClientRect();

      // lock color at press time so it can't change mid-animation
      const newRipple: Ripple = {
        id: Date.now(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        className: cn(rippleVariants({ variant }), rippleClassName),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    onPointerDown?.(event);
  };

  const rippleElements =
    ripple &&
    ripples.map((r) => (
      <motion.span
        key={r.id}
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale, opacity: 0 }}
        transition={transition}
        className={r.className}
        style={{
          top: r.y - 10,
          left: r.x - 10,
        }}
      />
    ));

  const sharedProps = {
    "data-slot": "button",
    onPointerDown: handlePointerDown,
    className: cn(buttonVariants({ variant, size, className })),
    disabled: disabled || isLoading,
    ...props,
  };

  if (asChild) {
    return (
      <Slot {...sharedProps}>
        <Slottable>{children}</Slottable>
        {rippleElements}
      </Slot>
    );
  }

  return (
    <MotionButton whileTap={{ scale: 0.98 }} {...sharedProps}>
      <span
        data-slot="button-content"
        className={cn(
          "flex items-center gap-[inherit]",
          isLoading && "invisible",
        )}
      >
        {children}
      </span>

      {isLoading && <Loader className="absolute inset-0" />}

      {rippleElements}
    </MotionButton>
  );
};

export { Button, buttonVariants };
