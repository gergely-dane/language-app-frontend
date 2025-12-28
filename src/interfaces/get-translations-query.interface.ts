export interface GetTranslationsQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortAscending?: boolean;
  sourceLanguageCode?: string;
  translationLanguageCode?: string;
}
