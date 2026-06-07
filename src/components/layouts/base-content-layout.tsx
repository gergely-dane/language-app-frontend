import { type ReactNode } from "react";

export const BaseContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-auto flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center px-2.5 pt-4 pb-19 xl:max-w-9/10 xl:pb-4 2xl:max-w-5/7">
      {children}
    </div>
  );
};
