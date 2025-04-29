import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <header className="flex justify-center px-4 py-4 w-full sm:px-6 bg-[var(--secondary)]">
        <Button>
          <Link href="/">Home</Link>
        </Button>
      </header>
    </div>
  );
}
