import { IconChevronsUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "./button";

export const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showButton && (
        <Button
          variant="outline"
          className="fixed bottom-18 right-4 w-10 h-10 rounded-full z-50 opacity-70"
          onClick={scrollToTop}
        >
          <IconChevronsUp />
        </Button>
      )}
    </>
  );
};
