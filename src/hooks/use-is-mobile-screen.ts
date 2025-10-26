import { useMediaQuery } from "react-responsive";

export const useIsMobileScreen = () => useMediaQuery({ maxWidth: "64rem" });
