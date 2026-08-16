import { type ReactNode } from "react";

export const BaseContentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-auto flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center px-2.5 pt-8 pb-19 max-md:pt-4 min-[1280px]:max-w-9/10 min-[1600px]:max-w-5/7 min-[2000px]:max-w-4/7 xl:pb-4">
      {children}
    </div>
  );
};
