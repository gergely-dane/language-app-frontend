import { type ReactNode } from "react";

export const BaseContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-auto flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center px-2.5 pt-4 pb-19 lg:max-w-3/5 lg:pb-4">
      {children}
    </div>
  );
};
