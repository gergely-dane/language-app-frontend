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
    <nav className="w-full bg-[var(--secondary)] border-b shadow-sm px-6 py-3 flex justify-center items-center">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-semibold">
          LanguageApp
        </Link>

        <div className="flex gap-3">
          <Link href="/">
            <Button variant="ghost" className="hover:text-black">
              <IconHome size={48} className="shrink-0" />
              <span className="hidden lg:block">Home</span>
            </Button>
          </Link>
          <Link href="/vocabulary">
            <Button variant="ghost" className="hover:text-black">
              <IconList />
              <span className="hidden lg:block">Vocabulary</span>
            </Button>
          </Link>
          <Link href="/cards">
            <Button variant="ghost" className="hover:text-black">
              <IconCards />
              <span className="hidden lg:block">Flashcards</span>
            </Button>
          </Link>
          <Link href="/translate">
            <Button variant="ghost" className="hover:text-black">
              <IconLanguage />
              <span className="hidden lg:block">Translate</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
