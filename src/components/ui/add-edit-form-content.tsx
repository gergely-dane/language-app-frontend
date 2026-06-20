import { IconCornerDownLeft, IconHelp, IconTrash } from "@tabler/icons-react";
import { type KeyboardEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputWithKbd } from "@/components/ui/input-with-kbd";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "@/components/ui/language-selector";
import { MultiSelectChipList } from "@/components/ui/multi-select-chip-list";
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
import { type Language } from "@/features/languages/interfaces/language.interface";
import { useCreateTranslation } from "@/features/vocabulary/api/create-translation";
import { useDeleteTranslation } from "@/features/vocabulary/api/delete-translation";
import { useImportSpreadsheet } from "@/features/vocabulary/api/import-spreadsheet";
import { useUpdateTranslation } from "@/features/vocabulary/api/update-translation";
import { ImportDropzone } from "@/features/vocabulary/components/import-dropzone";
import { type Translation } from "@/features/vocabulary/interfaces/translation.interface";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";

const LAST_ADDED_SOURCE_LANGUAGE_KEY = "lastAddedSourceLanguageId";
const LAST_ADDED_TRANSLATION_LANGUAGE_KEY = "lastAddedTranslationLanguageId";

type AddEditFormContentProps = {
  editMode?: boolean;
  onClose: () => void;
  currentTranslation?: Translation;
  onSave?: () => void;
};

export const AddEditFormContent = ({
  editMode = false,
  onClose,
  currentTranslation,
  onSave,
}: AddEditFormContentProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const { showAlert } = useAlert();
  const { data: languages } = useLanguages();

  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation(currentTranslation?.id);
  const deleteTranslation = useDeleteTranslation(currentTranslation?.id);
  const importSpreadsheet = useImportSpreadsheet();

  const [sourceLanguageId, setSourceLanguageId] = useState<number | null>(
    currentTranslation?.sourceLanguageId ||
      Number(localStorage.getItem(LAST_ADDED_SOURCE_LANGUAGE_KEY)) ||
      null,
  );
  const [translationLanguageId, setTranslationLanguageId] = useState<
    number | null
  >(
    currentTranslation?.translationLanguageId ||
      Number(localStorage.getItem(LAST_ADDED_TRANSLATION_LANGUAGE_KEY)) ||
      null,
  );
  const [word, setWord] = useState<string>(
    currentTranslation?.word?.word || "",
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
  const effectiveTranslationLanguageId =
    translationLanguageId ?? languages?.[1]?.id ?? languages?.[0]?.id ?? null;

  const sourceLanguage =
    languages?.find((lang) => lang.id === effectiveSourceLanguageId) || null;
  const translationLanguage =
    languages?.find((lang) => lang.id === effectiveTranslationLanguageId) ||
    null;

  const resetForm = () => {
    setWord("");
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
        setSourceLanguageId(effectiveTranslationLanguageId);
      }
      setTranslationLanguageId(selectedId);
    } else {
      if (selectedId === effectiveTranslationLanguageId) {
        setTranslationLanguageId(effectiveSourceLanguageId);
      }
      setSourceLanguageId(selectedId);
    }
  };

  const translationInputOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.stopPropagation();

    const trimmed = translation.trim();
    if (!trimmed) {
      formOnKeyDown(e);
      return;
    }

    if (trimmed.includes(",")) {
      const newTranslations = trimmed
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part && !translationList.includes(part));

      if (newTranslations.length) {
        setTranslationList([...translationList, ...newTranslations]);
      }
      setTranslation("");
      return;
    }

    if (!translationList.includes(trimmed)) {
      setTranslationList([...translationList, trimmed]);
      setTranslation("");
    } else {
      setTranslation("");
    }
  };

  const formOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;
    void handleSave();
  };

  const handleSave = async () => {
    if (
      !word ||
      (!translation && !translationList.length) ||
      !effectiveSourceLanguageId ||
      !effectiveTranslationLanguageId
    ) {
      return;
    }

    const payload = {
      word,
      translations: [...translationList, ...(translation ? [translation] : [])],
      sourceLanguageId: effectiveSourceLanguageId,
      translationLanguageId: effectiveTranslationLanguageId,
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
      }

      if (onSave) {
        onSave();
      }

      window.localStorage.setItem(
        LAST_ADDED_SOURCE_LANGUAGE_KEY,
        String(effectiveSourceLanguageId),
      );
      window.localStorage.setItem(
        LAST_ADDED_TRANSLATION_LANGUAGE_KEY,
        String(effectiveTranslationLanguageId),
      );

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

  const handleTranslationClicked = (item: string) => {
    setTranslation(item);
    setTranslationList(translationList.filter((t) => t !== item));
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
            <Input
              id="name"
              autoFocus={true}
              placeholder={t("vocabulary.enterTheWord")}
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />

            <LanguageSelector
              className="w-14 lg:w-32"
              value={sourceLanguage}
              onChange={(value) => handleLanguageChange(value, false)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <InputWithKbd
                placeholder={t("vocabulary.enterTheTranslation")}
                kbd={
                  <>
                    {!isMobile && <p>Enter</p>} <IconCornerDownLeft />
                  </>
                }
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                onKeyDown={translationInputOnKeyDown}
              />

              <LanguageSelector
                className="w-14 lg:w-32"
                value={translationLanguage}
                onChange={(value) => handleLanguageChange(value, true)}
              />
            </div>

            <MultiSelectChipList
              items={translationList}
              onChange={(items) => setTranslationList(items)}
              onItemClick={(item) => handleTranslationClicked(item)}
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
              !word ||
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
