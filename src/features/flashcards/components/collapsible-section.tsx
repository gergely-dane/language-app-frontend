"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useId } from "react";

import { SectionLabel } from "@/features/flashcards/components/section-label";
import { useCollapsedSection } from "@/features/flashcards/hooks/use-collapsed-section";
import type { FlashcardSection } from "@/features/flashcards/types";
import { cn } from "@/lib/utils";

type CollapsibleSectionProps = {
  section: FlashcardSection;
  title: string;
  defaultCollapsedOnShortScreen?: boolean;
  children: React.ReactNode;
};

export const CollapsibleSection = ({
  section,
  title,
  defaultCollapsedOnShortScreen,
  children,
}: CollapsibleSectionProps) => {
  const contentId = useId();
  const { isCollapsed, toggle } = useCollapsedSection(
    section,
    defaultCollapsedOnShortScreen,
  );

  return (
    <section className="bg-card flex flex-col gap-3 rounded-xl border p-4 max-lg:gap-2 max-lg:py-3">
      <SectionLabel className="lg:hidden">
        <button
          type="button"
          className="focus-visible:ring-ring/50 flex w-full cursor-pointer items-center justify-between rounded-sm uppercase outline-none focus-visible:ring-[3px]"
          aria-expanded={!isCollapsed}
          aria-controls={contentId}
          onClick={toggle}
        >
          {title}

          <IconChevronDown
            size={16}
            className={cn(
              "transition-transform duration-200",
              !isCollapsed && "rotate-180",
            )}
          />
        </button>
      </SectionLabel>

      <SectionLabel className="max-lg:hidden">{title}</SectionLabel>

      <div
        id={contentId}
        className={cn(
          "flex flex-col gap-3 max-lg:gap-2",
          isCollapsed && "max-lg:hidden",
        )}
      >
        {children}
      </div>
    </section>
  );
};
