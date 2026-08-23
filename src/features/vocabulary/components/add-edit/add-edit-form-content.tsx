import { IconHelp, IconLanguage, IconTrash } from "@tabler/icons-react";
import { type KeyboardEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { InputGroupButton } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAlert } from "@/context/alert-context";
import { useLanguages } from "@/features/languages/api/get-languages";
import { LanguageSelector } from "@/features/languages/components/language-selector";
import { type Language } from "@/features/languages/types";
import { useCreateTranslation } from "@/features/vocabulary/api/create-translation";
import { useDeleteTranslation } from "@/features/vocabulary/api/delete-translation";
import { useImportSpreadsheet } from "@/features/vocabulary/api/import-spreadsheet";
import { useTranslateWord } from "@/features/vocabulary/api/translate-word";
import { useUpdateTranslation } from "@/features/vocabulary/api/update-translation";
import {
  InlineTagInput,
  MAX_TAG_LENGTH,
  MAX_TAGS,
} from "@/features/vocabulary/components/add-edit/inline-tag-input";
import { ImportDropzone } from "@/features/vocabulary/components/import-dropzone";
import { MAX_TRANSLATION_CACHE_ENTRIES } from "@/features/vocabulary/constants";
import { type Translation } from "@/features/vocabulary/types";
import { setWithEvictOldest } from "@/features/vocabulary/utils";
import { useI18n } from "@/hooks/use-i18n";

const LAST_ADDED_SOURCE_LANGUAGE_KEY = "lastAddedSourceLanguageId";
const LAST_ADDED_TARGET_LANGUAGE_KEY = "lastAddedTargetLanguageId";

const translationCache = new Map<string, string[]>();

type AddEditFormContentProps = {
  editMode?: boolean;
  onClose: () => void;
  currentTranslation?: Translation;
  flashcardQueryKey?: readonly unknown[];
  onDeleted?: () => void;
};

export const AddEditFormContent = ({
  editMode = false,
  onClose,
  currentTranslation,
  flashcardQueryKey,
  onDeleted,
}: AddEditFormContentProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const { data: languages } = useLanguages();

  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation(currentTranslation?.id, {
    flashcardQueryKey,
  });
  const deleteTranslation = useDeleteTranslation(currentTranslation?.id);
  const importSpreadsheet = useImportSpreadsheet();
  const translateWord = useTranslateWord();

  const [sourceLanguageId, setSourceLanguageId] = useState<number | null>(
    currentTranslation?.sourceLanguageId ||
      Number(localStorage.getItem(LAST_ADDED_SOURCE_LANGUAGE_KEY)) ||
      null,
  );
  const [targetLanguageId, setTargetLanguageId] = useState<number | null>(
    currentTranslation?.targetLanguageId ||
      Number(localStorage.getItem(LAST_ADDED_TARGET_LANGUAGE_KEY)) ||
      null,
  );
  const [word, setWord] = useState<string>(
    currentTranslation?.words?.length === 1
      ? currentTranslation?.words?.[0]?.word
      : "",
  );
  const [wordList, setWordList] = useState<string[]>(
    currentTranslation?.words && currentTranslation.words.length > 1
      ? currentTranslation?.words?.map((w) => w.word)
      : [],
  );
  const [translation, setTranslation] = useState<string>(
    currentTranslation?.translations.length === 1
      ? currentTranslation?.translations?.[0]?.word
      : "",
  );
  const [translationList, setTranslationList] = useState<string[]>(
    currentTranslation?.translations &&
      currentTranslation.translations.length > 1
      ? currentTranslation?.translations?.map((t) => t.word)
      : [],
  );
  const [definition, setDefinition] = useState<string>(
    currentTranslation?.definition || "",
  );
  const [knowledgeLevel, setKnowledgeLevel] = useState<number[]>([0]);
  const [file, setFile] = useState<File | null>(null);

  const effectiveSourceLanguageId =
    sourceLanguageId ?? languages?.[0]?.id ?? null;
  const effectiveTargetLanguageId =
    targetLanguageId ?? languages?.[1]?.id ?? languages?.[0]?.id ?? null;

  const sourceLanguage =
    languages?.find((lang) => lang.id === effectiveSourceLanguageId) || null;
  const targetLanguage =
    languages?.find((lang) => lang.id === effectiveTargetLanguageId) || null;

  const resetForm = () => {
    setWord("");
    setWordList([]);
    setTranslation("");
    setTranslationList([]);
    setDefinition("");
    setKnowledgeLevel([0]);
  };

  const handleLanguageChange = (
    value: Language | null,
    translation: boolean,
  ) => {
    const selectedId = value?.id ?? null;

    if (translation) {
      if (selectedId === effectiveSourceLanguageId) {
        setSourceLanguageId(effectiveTargetLanguageId);
      }
      setTargetLanguageId(selectedId);
    } else {
      if (selectedId === effectiveTargetLanguageId) {
        setTargetLanguageId(effectiveSourceLanguageId);
      }
      setSourceLanguageId(selectedId);
    }
  };

  const formOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;
    void handleSave();
  };

  const handleEmptyEnter = () => {
    void handleSave();
  };

  const handleSave = async () => {
    if (
      (!word && !wordList.length) ||
      (!translation && !translationList.length) ||
      !effectiveSourceLanguageId ||
      !effectiveTargetLanguageId
    ) {
      return;
    }

    const parseInputToTags = (inputValue: string, currentTags: string[]) => {
      const trimmed = inputValue.trim();
      if (!trimmed) return currentTags;

      const newTags = trimmed
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part && !currentTags.includes(part))
        .map((part) => part.slice(0, MAX_TAG_LENGTH));

      return [...currentTags, ...newTags].slice(0, MAX_TAGS);
    };

    const finalWords = parseInputToTags(word, wordList);
    const finalTranslations = parseInputToTags(translation, translationList);

    const payload = {
      words: finalWords,
      translations: finalTranslations,
      sourceLanguageId: effectiveSourceLanguageId,
      targetLanguageId: effectiveTargetLanguageId,
      definition,
    };

    try {
      if (editMode) {
        await updateTranslation.mutateAsync(payload);
      } else {
        await createTranslation.mutateAsync({
          ...payload,
          knowledgeLevel: knowledgeLevel[0],
        });

        resetForm();

        window.localStorage.setItem(
          LAST_ADDED_SOURCE_LANGUAGE_KEY,
          String(effectiveSourceLanguageId),
        );
        window.localStorage.setItem(
          LAST_ADDED_TARGET_LANGUAGE_KEY,
          String(effectiveTargetLanguageId),
        );
      }

      onClose();
      showAlert({
        title: t("vocabulary.translationSavedSuccessfully"),
        variant: "default",
      });
    } catch (error: any) {
      showAlert({
        title:
          (error.response?.data?.message as string) ||
          t("vocabulary.errorAddingTranslation"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTranslation.mutateAsync();
      onDeleted?.();
      onClose();
      showAlert({
        title: t("vocabulary.translationDeletedSuccessfully"),
        variant: "default",
      });
    } catch (error: any) {
      showAlert({
        title:
          (error.response?.data?.message as string) ||
          t("vocabulary.errorDeletingTranslation"),
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const response = await importSpreadsheet.mutateAsync({ file });
      onClose();
      showAlert({
        title: `${t("vocabulary.successfullyImported")} ${response.importedCount} ${t("vocabulary.translations")}.`,
        variant: "default",
      });
    } catch (error: any) {
      showAlert({
        title:
          (error.response?.data?.message as string) ||
          t("vocabulary.anErrorOccurredWhileImportingTranslations"),
        variant: "destructive",
      });
    }
  };

  const handleTranslate = async () => {
    const firstWordToTranslate =
      [...wordList, ...(word ? [word.trim()] : [])][0] || "";

    if (
      !firstWordToTranslate ||
      !effectiveSourceLanguageId ||
      !effectiveTargetLanguageId
    ) {
      return;
    }

    const cacheKey = `${firstWordToTranslate}_${effectiveSourceLanguageId}_${effectiveTargetLanguageId}`;

    try {
      let translations: string[];
      if (translationCache.has(cacheKey)) {
        translations = translationCache.get(cacheKey)!;
      } else {
        const result = await translateWord.mutateAsync({
          word: firstWordToTranslate,
          sourceLanguageId: effectiveSourceLanguageId,
          targetLanguageId: effectiveTargetLanguageId,
        });
        translations = result.translations;
        setWithEvictOldest(
          translationCache,
          cacheKey,
          translations,
          MAX_TRANSLATION_CACHE_ENTRIES,
        );
      }

      const overlapping = translations.filter((t) =>
        translationList.includes(t),
      );

      if (overlapping.length > 0) {
        setTranslationList((prev) =>
          prev.filter((t) => !overlapping.includes(t)),
        );
      }

      const newTranslationsStr = translations.join(", ");

      if (newTranslationsStr) {
        setTranslation(newTranslationsStr);
      }
    } catch {
      showAlert({
        title: t("vocabulary.errorTranslatingWord", {
          word: firstWordToTranslate,
          targetLanguage: targetLanguage?.englishName || "...",
        }),
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs className="mt-4" defaultValue="addWord">
      {!editMode && (
        <TabsList className="mb-1 w-full">
          <TabsTrigger value="addWord">{t("vocabulary.addWord")}</TabsTrigger>
          <TabsTrigger value="import">{t("vocabulary.import")}</TabsTrigger>
        </TabsList>
      )}

      <TabsContent
        className="flex flex-col"
        value="addWord"
        onKeyDown={formOnKeyDown}
      >
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <InlineTagInput
              id="name"
              autoFocus={true}
              enterKeyHint="done"
              autoCapitalize="none"
              placeholder={t("vocabulary.enterTheWord")}
              tags={wordList}
              onTagsChange={setWordList}
              inputValue={word}
              onInputValueChange={setWord}
              onEmptyEnter={handleEmptyEnter}
              addonEnd={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      className="border-input size-9 shrink-0 rounded-md border p-0 shadow-xs"
                      variant="outline"
                      onClick={() => void handleTranslate()}
                      isLoading={translateWord.isPending}
                      disabled={
                        (!word.trim() && !wordList.length) ||
                        !effectiveSourceLanguageId ||
                        !effectiveTargetLanguageId
                      }
                    >
                      <IconLanguage className="text-primary size-4" />
                    </InputGroupButton>
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>
                      {t.rich("vocabulary.translateWordInto", {
                        word:
                          [...wordList, ...(word ? [word] : [])][0] || "...",
                        targetLanguage: targetLanguage?.englishName || "...",
                        bold: (chunks) => (
                          <span className="font-semibold">{chunks}</span>
                        ),
                      })}
                    </p>
                  </TooltipContent>
                </Tooltip>
              }
            />

            <LanguageSelector
              className="w-14 lg:w-32"
              role="source"
              value={sourceLanguage}
              onChange={(value) => handleLanguageChange(value, false)}
            />
          </div>

          <div className="flex items-center gap-2">
            <InlineTagInput
              placeholder={t("vocabulary.enterTheTranslation")}
              enterKeyHint="done"
              autoCapitalize="none"
              tags={translationList}
              onTagsChange={setTranslationList}
              inputValue={translation}
              onInputValueChange={setTranslation}
              onEmptyEnter={handleEmptyEnter}
            />

            <LanguageSelector
              className="w-14 lg:w-32"
              role="target"
              value={targetLanguage}
              onChange={(value) => handleLanguageChange(value, true)}
            />
          </div>

          <Textarea
            placeholder={t("vocabulary.enterDefinition")}
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            maxLength={500}
          />
        </div>

        {!editMode && (
          <div className="mt-3">
            <div className="flex">
              <Label htmlFor="knowledgeLevelSlider">
                {t("vocabulary.howWellDoYouKnowTheWord")}
              </Label>

              <Tooltip>
                <TooltipTrigger asChild>
                  <IconHelp className="text-muted-foreground ml-1" size={18} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("vocabulary.adjustTheSlider")}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div>
              <Slider
                className="h-8"
                id="knowledgeLevelSlider"
                value={knowledgeLevel}
                onValueChange={setKnowledgeLevel}
                min={0}
                max={3}
                step={1}
              />

              <div className="-mt-1 flex text-xs">
                <div>{t("vocabulary.justLearnedIt")}</div>
                <div className="ml-auto">{t("vocabulary.knowItVeryWell")}</div>
              </div>
            </div>
          </div>
        )}

        <div className="relative mt-4 flex">
          <Button
            className="mx-auto w-30"
            variant="outline"
            onClick={() => void handleSave()}
            isLoading={
              createTranslation.isPending || updateTranslation.isPending
            }
            disabled={
              createTranslation.isPending ||
              updateTranslation.isPending ||
              (!word && !wordList.length) ||
              (!translationList.length && !translation)
            }
          >
            {t("general.save")}
          </Button>

          {editMode && (
            <Button
              className="absolute"
              variant="outline"
              size="icon"
              onClick={() => void handleDelete()}
            >
              <IconTrash className="text-destructive" />
            </Button>
          )}
        </div>
      </TabsContent>

      <TabsContent className="flex flex-col" value="import">
        <ImportDropzone file={file} onChange={setFile} />

        <Button
          className="mx-auto mt-4 w-30"
          variant="outline"
          onClick={() => void handleImport()}
          disabled={!file}
        >
          {t("vocabulary.import")}
        </Button>
      </TabsContent>
    </Tabs>
  );
};
