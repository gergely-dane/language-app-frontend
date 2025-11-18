import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import React, { ReactNode } from "react";

type InputWithKbdProps = {
  kbd: ReactNode;
};

export const InputWithKbd = ({
  kbd,
  className,
  type,
  ...props
}: InputWithKbdProps & React.ComponentProps<"input">) => {
  return (
    <InputGroup className={className}>
      <InputGroupInput type={type} {...props} />
      {kbd && (
        <InputGroupAddon align="inline-end">
          <Kbd>{kbd}</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};
