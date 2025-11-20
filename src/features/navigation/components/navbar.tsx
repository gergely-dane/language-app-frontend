"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { UserButton } from "./user-button";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 flex w-full items-center gap-6 border-b px-2.5 py-3 shadow-sm z-10 bg-background/80">
      <Link className="text-xl text-primary font-semibold" href="/">
        LanguageApp
      </Link>

      {isAuthenticated && <UserButton className="absolute right-0 mr-3" />}
    </nav>
  );
};
