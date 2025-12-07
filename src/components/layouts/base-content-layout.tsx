import { ReactNode } from "react";

export const BaseContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-[calc(100vh-var(--navbar-height))] items-center justify-center m-auto px-2.5 py-4 lg:max-w-3/5">
      {children}
    </div>
  );
};
