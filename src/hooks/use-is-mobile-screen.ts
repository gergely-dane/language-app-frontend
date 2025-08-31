import { useMediaQuery } from "react-responsive";

export function useIsMobileScreen() {
  return useMediaQuery({ maxWidth: "64rem" });
}
