"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AddEditWordDialog } from "@/features/vocabulary/components/add-edit-word-dialog";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { Translation, Word } from "@/interfaces/translation.interface";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/utils/cn";
import {
  IconArrowNarrowRight,
  IconPencil,
  IconStar,
} from "@tabler/icons-react";
import { ColumnDef, HeaderContext } from "@tanstack/react-table";
import { useState } from "react";
import { SortableTableHeaderText } from "./sortable-table-header-text";

const WordHeader = ({ column }: HeaderContext<Translation, unknown>) => {
  const t = useI18n();
  return (
    <SortableTableHeaderText headerName={t("general.word")} column={column} />
  );
};

const TranslationsHeader = () => {
  const t = useI18n();
  return <p>{t("general.translations")}</p>;
};

const LanguageHeader = () => {
  const t = useI18n();
  return <p>{t("general.language")}</p>;
};

const AddedOnHeader = ({ column }: HeaderContext<Translation, unknown>) => {
  const t = useI18n();
  return (
    <SortableTableHeaderText
      headerName={t("general.addedOn")}
      column={column}
    />
  );
};

const KnowledgeLevelHeader = ({
  column,
}: HeaderContext<Translation, unknown>) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  return (
    <SortableTableHeaderText
      headerName={!isMobile ? t("general.knowledgeLevel") : ""}
      icon={isMobile ? <IconStar className="my-auto" size={16} /> : null}
      column={column}
    />
  );
};

export const columns: ColumnDef<Translation>[] = [
  {
    id: "word",
    accessorFn: (tr) => tr.word?.word,
    header: WordHeader,
    filterFn: "includesString",
  },
  {
    accessorKey: "translations",
    header: TranslationsHeader,
    cell: ({ getValue }) => {
      return (getValue() as Word[])?.map((w: Word) => w.word)?.join(", ");
    },
  },
  {
    id: "language",
    header: LanguageHeader,
    accessorFn: (tr) => {
      return `${tr.sourceLanguageCode}-${tr.translationLanguageCode}`;
    },
    cell: ({ getValue }) => {
      const [sourceLanguage, translationLanguage] = (
        getValue() as string
      ).split("-");
      const isMobile = useIsMobileScreen();

      return (
        <div className="flex gap-0.5">
          <p className={isMobile ? "uppercase" : ""}>
            {!isMobile ? LANGUAGES[sourceLanguage] : sourceLanguage}
          </p>

          <IconArrowNarrowRight className="mt-0.5" size={16} />

          <p className={isMobile ? "uppercase" : ""}>
            {!isMobile ? LANGUAGES[translationLanguage] : translationLanguage}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: AddedOnHeader,
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "score",
    header: KnowledgeLevelHeader,
    cell: ({ getValue }) => {
      const level = Math.ceil((getValue() as number) / 25);
      const colors = [
        "bg-orange-500",
        "bg-yellow-500",
        "bg-lime-500",
        "bg-green-500",
        "bg-green-500",
      ] as const;

      return <div className={cn("h-4 w-4 rounded-full", colors[level])} />;
    },
  },
  {
    id: "edit",
    cell: ({ row }) => {
      const [dialogOpen, setDialogOpen] = useState(false);
      const rowData = row.original;

      return (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDialogOpen(true)}
          >
            <IconPencil />
          </Button>

          <AddEditWordDialog
            open={dialogOpen}
            onOpenChange={(open) => setDialogOpen(open)}
            id={rowData.id}
            editMode={true}
            currentTranslation={rowData}
          />
        </>
      );
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mr-4 pt-4"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mr-4 pt-4"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
        aria-label="Select row"
      />
    ),
  },
];
