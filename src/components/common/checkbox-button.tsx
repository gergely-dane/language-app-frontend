import React from "react";

import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type CheckboxButtonProps = React.ComponentProps<typeof Checkbox> & {
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg";
  id?: string;
  disabled?: boolean;
  "data-state"?: string;
  "data-disabled"?: string;
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
      onClick,
      onPointerDown,
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      onKeyDown,
      "data-state": dataState,
      "data-disabled": dataDisabled,
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
        onClick={
          onClick as unknown as React.MouseEventHandler<HTMLLabelElement>
        }
        onPointerDown={
          onPointerDown as unknown as React.PointerEventHandler<HTMLLabelElement>
        }
        onPointerMove={
          onPointerMove as unknown as React.PointerEventHandler<HTMLLabelElement>
        }
        onPointerEnter={
          onPointerEnter as unknown as React.PointerEventHandler<HTMLLabelElement>
        }
        onPointerLeave={
          onPointerLeave as unknown as React.PointerEventHandler<HTMLLabelElement>
        }
        onFocus={
          onFocus as unknown as React.FocusEventHandler<HTMLLabelElement>
        }
        onBlur={onBlur as unknown as React.FocusEventHandler<HTMLLabelElement>}
        onKeyDown={
          onKeyDown as unknown as React.KeyboardEventHandler<HTMLLabelElement>
        }
        data-state={dataState}
        data-disabled={dataDisabled}
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
