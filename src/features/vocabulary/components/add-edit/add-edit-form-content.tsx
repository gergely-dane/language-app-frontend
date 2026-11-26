import { IconHelp, IconLanguage, IconTrash } from "@tabler/icons-react";
import { type KeyboardEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { InputGroupButton } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { useAlert } from "@/context/alert-context";
import { useLanguages } from "@/features/languages/api/get-languages";
import { LanguageSelector } from "@/features/languages/components/language-selector";
import { type Language } from "@/features/languages/types";
import { useCreateTranslation } from "@/features/vocabulary/api/create-translation";
import { useDeleteTranslation } from "@/features/vocabulary/api/delete-translation";
import { useTranslateWord } from "@/features/vocabulary/api/translate-word";
import { useUpdateTranslation } from "@/features/vocabulary/api/update-translation";
import { InlineTagInput } from "@/features/vocabulary/components/add-edit/inline-tag-input";
import { ResetProgressButton } from "@/features/vocabulary/components/add-edit/reset-progress-button";
import { ImportDropzone } from "@/features/vocabulary/components/import/import-dropzone";
import {
  LAST_ADDED_SOURCE_LANGUAGE_KEY,
  LAST_ADDED_TARGET_LANGUAGE_KEY,
  MAX_TRANSLATION_CACHE_ENTRIES,
} from "@/features/vocabulary/constants";
import { useImportFile } from "@/features/vocabulary/hooks/use-import-file";
import { type Translation } from "@/features/vocabulary/types";
import {
  getStoredLanguageId,
  parseTagInput,
  setWithEvictOldest,
  storeLastAddedLanguageId,
} from "@/features/vocabulary/utils";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

const translationCache = new Map<string, string[]>();

type AddEditFormContentProps = {
  editMode?: boolean;
  onClose: () => void;
  currentTranslation?: Translation;
  flashcardQueryKey?: readonly unknown[];
  onDeleted?: () => void;
  onProgressReset?: () => void;
};

export const AddEditFormContent = ({
  editMode = false,
  onClose,
  currentTranslation,
  flashcardQueryKey,
  onDeleted,
  onProgressReset,
}: AddEditFormContentProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const { data: languages, getLanguageName } = useLanguages();

  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation(currentTranslation?.id, {
    flashcardQueryKey,
  });
  const deleteTranslation = useDeleteTranslation(currentTranslation?.id);
  const translateWord = useTranslateWord();
  const {
    file,
    setFile,
    importFile,
    isPending: isImportPending,
  } = useImportFile(onClose);
  const isMobile = useIsMobileScreen();

  const [sourceLanguageId, setSourceLanguageId] = useState<number | null>(
    () =>
      currentTranslation?.sourceLanguageId ??
      getStoredLanguageId(LAST_ADDED_SOURCE_LANGUAGE_KEY),
  );
  const [targetLanguageId, setTargetLanguageId] = useState<number | null>(
    () =>
      currentTranslation?.targetLanguageId ??
      getStoredLanguageId(LAST_ADDED_TARGET_LANGUAGE_KEY),
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
  const [tab, setTab] = useState("addWord");

  const showImportTab = !editMode && isMobile;

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

    const finalWords = parseTagInput(word, wordList);
    const finalTranslations = parseTagInput(translation, translationList);

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

        storeLastAddedLanguageId(
          LAST_ADDED_SOURCE_LANGUAGE_KEY,
          effectiveSourceLanguageId,
        );
        storeLastAddedLanguageId(
          LAST_ADDED_TARGET_LANGUAGE_KEY,
          effectiveTargetLanguageId,
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
          targetLanguage:
            (targetLanguage && getLanguageName(targetLanguage)) || "...",
        }),
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs
      className="mt-4"
      value={showImportTab ? tab : "addWord"}
      onValueChange={setTab}
    >
      {showImportTab && (
        <TabsList className="mb-1 w-full">
          <TabsTrigger value="addWord">{t("vocabulary.addWord")}</TabsTrigger>

          <TabsTrigger value="import">
            {t("vocabulary.import.button")}
          </TabsTrigger>
        </TabsList>
      )}

      <div className="grid">
        <TabsContent
          className="col-start-1 row-start-1 flex flex-col data-[state=inactive]:invisible"
          value="addWord"
          forceMount
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
                  <Tooltip
                    content={t.rich("vocabulary.translateWordInto", {
                      word: [...wordList, ...(word ? [word] : [])][0] || "...",
                      targetLanguage:
                        (targetLanguage && getLanguageName(targetLanguage)) ||
                        "...",
                      bold: (chunks) => (
                        <span className="font-semibold">{chunks}</span>
                      ),
                    })}
                  >
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

                <Tooltip content={t("vocabulary.adjustTheSlider")}>
                  <IconHelp className="text-muted-foreground ml-1" size={18} />
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
                  <div className="ml-auto">
                    {t("vocabulary.knowItVeryWell")}
                  </div>
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
              <div className="absolute flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => void handleDelete()}
                >
                  <IconTrash className="text-destructive" />
                </Button>

                <ResetProgressButton
                  translationId={currentTranslation?.id}
                  onReset={() => {
                    onProgressReset?.();
                    onClose();
                  }}
                />
              </div>
            )}
          </div>
        </TabsContent>

        {showImportTab && (
          <TabsContent
            className="col-start-1 row-start-1 flex flex-col data-[state=inactive]:invisible"
            value="import"
            forceMount
          >
            <ImportDropzone
              className="mt-2 flex-1"
              file={file}
              onChange={setFile}
            />

            <Button
              className="mx-auto mt-4 w-30"
              variant="outline"
              onClick={() => void importFile()}
              isLoading={isImportPending}
              disabled={!file}
            >
              {t("vocabulary.import.button")}
            </Button>
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};
