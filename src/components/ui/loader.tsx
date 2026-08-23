import { DotsBounceIcon } from "@/components/icons/dots-bounce-icon";
import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
};

export const Loader = ({ className }: LoaderProps) => (
  <span className={cn("flex items-center justify-center", className)}>
    <DotsBounceIcon />
  </span>
);
