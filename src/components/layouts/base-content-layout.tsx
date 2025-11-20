import { ReactNode } from "react";

export const BaseContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-auto px-2.5 pt-4 pb-18 lg:max-w-3/5">{children}</div>
  );
};
