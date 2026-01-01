import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
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
import { useCreateTranslation } from "@/features/vocabulary/api/create-translation";
import { useDeleteTranslation } from "@/features/vocabulary/api/delete-translation";
import { useImportSpreadsheet } from "@/features/vocabulary/api/import-spreadsheet";
import { useUpdateTranslation } from "@/features/vocabulary/api/update-translation";
import { ImportDropzone } from "@/features/vocabulary/components/import-dropzone";
import { useI18n } from "@/hooks/use-i18n";
import { useIsMobileScreen } from "@/hooks/use-is-mobile-screen";
import { Translation } from "@/interfaces/translation.interface";
import { IconCornerDownLeft, IconHelp, IconTrash } from "@tabler/icons-react";
import { KeyboardEvent, useEffect, useState } from "react";

type AddEditFormProps = {
  editMode?: boolean;
  onClose: () => void;
  currentTranslation?: Translation;
};

const AddEditForm = ({
  editMode = false,
  onClose,
  currentTranslation,
}: AddEditFormProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();
  const { showAlert } = useAlert();
  const { data: languages } = useLanguages();

  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation(currentTranslation?.id);
  const deleteTranslation = useDeleteTranslation(currentTranslation?.id);
  const importSpreadsheet = useImportSpreadsheet();

  const [sourceLanguageCode, setSourceLanguageCode] = useState<string | null>(
    currentTranslation?.sourceLanguageCode || null,
  );
  const [translationLanguageCode, setTranslationLanguageCode] = useState<
    string | null
  >(currentTranslation?.translationLanguageCode || null);

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

  useEffect(() => {
    setSourceLanguageCode(languages?.[0]?.code ?? null);
    setTranslationLanguageCode(languages?.[1]?.code ?? null);
  }, [languages]);

  const resetForm = () => {
    setWord("");
    setTranslation("");
    setTranslationList([]);
    setDefinition("");
    setKnowledgeLevel([0]);
  };

  const handleLanguageChange = (value: string | null, translation: boolean) => {
    if (translation) {
      if (value === sourceLanguageCode) {
        setSourceLanguageCode(translationLanguageCode);
      }
      setTranslationLanguageCode(value);
    } else {
      if (value === translationLanguageCode) {
        setTranslationLanguageCode(sourceLanguageCode);
      }
      setSourceLanguageCode(value);
    }
  };

  const translationInputOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const trimmed = translation.trim();
    if (trimmed && !translationList.includes(trimmed)) {
      setTranslationList([...translationList, trimmed]);
      setTranslation("");
    }
  };

  const handleSave = async () => {
    if (
      !word ||
      (!translation && !translationList.length) ||
      !sourceLanguageCode ||
      !translationLanguageCode
    ) {
      return;
    }

    const payload = {
      word,
      translations: [
        ...translationList,
        ...(!!translation ? [translation] : []),
      ],
      sourceLanguageCode,
      translationLanguageCode,
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

      onClose();
      showAlert({
        title: t("vocabulary.translationSavedSuccessfully"),
        variant: "default",
      });
    } catch (error: any) {
      showAlert({
        title:
          error.response?.data?.message ||
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
          error.response?.data?.message ||
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
          error.response?.data?.message ||
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
        <TabsList className="w-full mb-1">
          <TabsTrigger value="addWord">{t("vocabulary.addWord")}</TabsTrigger>
          <TabsTrigger value="import">{t("vocabulary.import")}</TabsTrigger>
        </TabsList>
      )}

      <TabsContent className="flex flex-col" value="addWord">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Input
              id="name"
              placeholder={t("vocabulary.enterTheWord")}
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />

            <LanguageSelector
              className="w-14 lg:w-32"
              value={sourceLanguageCode}
              onChange={(value) => handleLanguageChange(value, false)}
              languages={languages?.map((lang) => lang.code) || []}
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
                value={translationLanguageCode}
                onChange={(value) => handleLanguageChange(value, true)}
                languages={languages?.map((lang) => lang.code) || []}
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
                max={4}
                step={1}
              />

              <div className="-mt-1 flex text-xs">
                <div>{t("vocabulary.justLearnedIt")}</div>
                <div className="ml-auto">{t("vocabulary.knowItVeryWell")}</div>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex mt-4">
          <Button
            className="mx-auto w-30"
            variant="outline"
            onClick={handleSave}
            disabled={
              createTranslation.isPending ||
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
              onClick={handleDelete}
            >
              <IconTrash className="text-destructive" />
            </Button>
          )}
        </div>
      </TabsContent>

      <TabsContent className="flex flex-col" value="import">
        <ImportDropzone file={file} onChange={setFile} />

        <Button
          className="mt-4 mx-auto w-30"
          variant="outline"
          onClick={handleImport}
          disabled={!file}
        >
          {t("vocabulary.import")}
        </Button>
      </TabsContent>
    </Tabs>
  );
};

type AddEditWordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode?: boolean;
  currentTranslation?: Translation;
};

export const AddEditWordDialog = ({
  open,
  onOpenChange,
  editMode = false,
  currentTranslation,
}: AddEditWordDialogProps) => {
  const t = useI18n();
  const isMobile = useIsMobileScreen();

  const form = (
    <AddEditForm
      editMode={editMode}
      onClose={() => onOpenChange(false)}
      currentTranslation={currentTranslation}
    />
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle className="sr-only">{t("vocabulary.addWord")}</DialogTitle>
        <DialogContent className="px-4 lg:px-8">{form}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTitle className="sr-only">{t("vocabulary.addWord")}</DrawerTitle>
      <DrawerContent className="px-4 pb-4">{form}</DrawerContent>
    </Drawer>
  );
};
