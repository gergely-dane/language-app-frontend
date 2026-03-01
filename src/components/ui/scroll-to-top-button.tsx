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
          className="fixed right-3 bottom-18 z-50 h-10 w-10 rounded-full opacity-70"
          onClick={scrollToTop}
        >
          <IconChevronsUp />
        </Button>
      )}
    </>
  );
};
