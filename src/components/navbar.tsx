import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCards, IconHome, IconList } from "@tabler/icons-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex justify-center items-center">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-semibold text-gray-800">
          LanguageApp
        </Link>

        <div className="flex gap-3">
          <Link href="/">
            <Button variant="ghost" className="text-gray-700 hover:text-black">
              <IconHome />
              <span className="hidden lg:block">Home</span>
            </Button>
          </Link>
          <Link href="/vocabulary">
            <Button variant="ghost" className="text-gray-700 hover:text-black">
              <IconList />
              <span className="hidden lg:block">Vocabulary</span>
            </Button>
          </Link>
          <Link href="/cards">
            <Button variant="ghost" className="text-gray-700 hover:text-black">
              <IconCards size={48} />
              <span className="hidden lg:block">Flashcards</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
