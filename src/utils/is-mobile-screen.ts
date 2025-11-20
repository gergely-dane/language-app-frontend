"use server";

import { MAX_MOBILE_WIDTH, MOBILE_AGENT_REGEX } from "@/lib/constants";
import { headers } from "next/headers";
export const isMobileScreen = async (): Promise<boolean> => {
  const h = await headers();
  const deviceWidth = h.get("sec-ch-viewport-width");
  const userAgent = h.get("user-agent") || "";

  if (deviceWidth && !isNaN(Number(deviceWidth))) {
    return Number(deviceWidth) < MAX_MOBILE_WIDTH;
  }

  return MOBILE_AGENT_REGEX.test(userAgent);
};
