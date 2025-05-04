import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCards, IconHome, IconList } from "@tabler/icons-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex justify-center items-center">
      <div className="flex items-center gap-6">
        <Link href="/">
          <span className="text-xl font-semibold text-gray-800">
            LanguageApp
          </span>
        </Link>

        <div className="flex gap-3">
          <Link href="/">
            <Button variant="ghost" className="text-gray-700 hover:text-black">
              <IconHome />
              Home
            </Button>
          </Link>
          <Link href="/vocabulary">
            <Button variant="ghost" className="text-gray-700 hover:text-black">
              <IconList />
              Vocabulary
            </Button>
          </Link>
          <Link href="/cards">
            <Button variant="ghost" className="text-gray-700 hover:text-black">
              <IconCards />
              Flashcards
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
