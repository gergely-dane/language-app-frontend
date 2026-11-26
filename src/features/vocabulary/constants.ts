import type { ExportFormat } from "@/features/vocabulary/types";

export const ALLOWED_IMPORT_EXTENSIONS = [".xlsx", ".xls", ".csv"];

export const MAX_TAGS = 5;

export const MAX_TAG_LENGTH = 100;

export const TAG_DRAG_THRESHOLD_PX = 5;

export const TAG_REORDER_COOLDOWN_MS = 120;

export const MAX_AUDIO_CACHE_ENTRIES = 50;

export const MAX_TRANSLATION_CACHE_ENTRIES = 100;

export const PAGINATION_SIBLINGS_MOBILE = 1;

export const PAGINATION_SIBLINGS_DESKTOP = 2;

export const LAST_ADDED_SOURCE_LANGUAGE_KEY = "lastAddedSourceLanguageId";

export const LAST_ADDED_TARGET_LANGUAGE_KEY = "lastAddedTargetLanguageId";

export const EXPORT_FORMAT = {
  Xlsx: 0,
  Csv: 1,
} as const;

export const EXPORT_FORMAT_EXTENSIONS: Record<ExportFormat, string> = {
  [EXPORT_FORMAT.Xlsx]: "xlsx",
  [EXPORT_FORMAT.Csv]: "csv",
};

export const EXPORT_FORMAT_OPTIONS = [
  {
    value: EXPORT_FORMAT.Xlsx,
    label: "formatXlsx",
    tooltip: "formatXlsxTooltip",
  },
  {
    value: EXPORT_FORMAT.Csv,
    label: "formatCsv",
    tooltip: "formatCsvTooltip",
  },
] as const;

export const EXPORT_SCOPE = {
  Selected: "selected",
  Filtered: "filtered",
  All: "all",
} as const;

export const EXPORT_SCOPE_OPTIONS = [
  {
    value: EXPORT_SCOPE.Selected,
    label: "scopeSelected",
    tooltip: "scopeSelectedTooltip",
  },
  {
    value: EXPORT_SCOPE.Filtered,
    label: "scopeFiltered",
    tooltip: "scopeFilteredTooltip",
  },
  {
    value: EXPORT_SCOPE.All,
    label: "scopeAll",
    tooltip: "scopeAllTooltip",
  },
] as const;
