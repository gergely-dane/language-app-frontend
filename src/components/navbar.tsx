import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconCards,
  IconHome,
  IconLanguage,
  IconList,
} from "@tabler/icons-react";

export default function Navbar() {
  return (
    <nav className="bg-muted-foreground/50 flex w-full items-center justify-center border-b px-6 py-3 shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-semibold">
          LanguageApp
        </Link>

        <div className="flex gap-3">
          <Link href="/">
            <Button variant="ghost">
              <IconHome size={48} className="shrink-0" />
              <span className="hidden lg:block">Home</span>
            </Button>
          </Link>
          <Link href="/vocabulary">
            <Button variant="ghost">
              <IconList />
              <span className="hidden lg:block">Vocabulary</span>
            </Button>
          </Link>
          <Link href="/flashcards">
            <Button variant="ghost">
              <IconCards />
              <span className="hidden lg:block">Flashcards</span>
            </Button>
          </Link>
          <Link href="/translate">
            <Button variant="ghost">
              <IconLanguage />
              <span className="hidden lg:block">Translate</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
