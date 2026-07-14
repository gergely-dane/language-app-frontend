import React from "react";

import { cn } from "@/utils/cn";

import { buttonVariants } from "./button";
import { Checkbox } from "./checkbox";

type CheckboxButtonProps = React.ComponentProps<typeof Checkbox> & {
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg";
  id?: string;
  disabled?: boolean;
};

const CheckboxButton = React.forwardRef<HTMLLabelElement, CheckboxButtonProps>(
  (
    {
      className,
      label,
      variant = "outline",
      size = "default",
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <label
        ref={ref}
        htmlFor={checkboxId}
        className={cn(
          buttonVariants({ variant, size }),
          "flex cursor-pointer items-center justify-between gap-2 px-2 font-normal select-none",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <Checkbox id={checkboxId} disabled={disabled} {...props} />
        {label && <span className="text-sm leading-none">{label}</span>}
      </label>
    );
  },
);
CheckboxButton.displayName = "CheckboxButton";

export { CheckboxButton };
