"use client";

import { motion } from "motion/react";

import { FADE_TRANSITION } from "@/features/flashcards/constants";

type FlashcardStackProps = {
  isHidden: boolean;
};

export const FlashcardStack = ({ isHidden }: FlashcardStackProps) => (
  <motion.div
    aria-hidden="true"
    className="absolute inset-0"
    initial={false}
    animate={{ opacity: isHidden ? 0 : 1 }}
    transition={FADE_TRANSITION}
  >
    <div className="ring-foreground absolute inset-x-0 top-4 mx-auto h-54 w-[98%] rounded-xl bg-[oklch(from_var(--color-primary)_calc(l*1.3)_c_h)] ring-2 md:h-66 lg:h-76" />

    <div className="ring-foreground absolute inset-x-0 top-2 mx-auto h-54 w-[99%] rounded-xl bg-[oklch(from_var(--color-primary)_calc(l*1.15)_c_h)] ring-2 md:h-66 lg:h-76" />
  </motion.div>
);
