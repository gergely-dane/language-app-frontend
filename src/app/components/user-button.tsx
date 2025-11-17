import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconUser } from "@tabler/icons-react";

interface UserButtonProps {
  className?: string;
  onClick?: () => void;
}

export const UserButton = ({ className, onClick }: UserButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("bg-white rounded-full", className)}
      onClick={onClick}
    >
      <IconUser />
    </Button>
  );
};
