import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputWithKbd } from "@/components/ui/input-with-kbd";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "@/components/ui/language-selector";
import { MultiSelectChipList } from "@/components/ui/multi-select-chip-list";
import { Slider } from "@/components/ui/slider";
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
import { useUpdateTranslation } from "@/features/vocabulary/api/update-translation";
import { useI18n } from "@/hooks/use-i18n";
import { IconCornerDownLeft, IconHelp, IconTrash } from "@tabler/icons-react";
import { KeyboardEvent, useEffect, useState } from "react";

type AddEditWordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: number;
  editMode?: boolean;
  currentSourceLanguageCode?: string;
  currentTranslationLanguageCode?: string;
  currentWord?: string;
  currentTranslationList?: string[];
  currentDefinition?: string;
};

export const AddEditWordDialog = ({
  open,
  onOpenChange,
  id,
  editMode = false,
  currentSourceLanguageCode = "",
  currentTranslationLanguageCode = "",
  currentWord = "",
  currentTranslationList = [],
  currentDefinition = "",
}: AddEditWordDialogProps) => {
  const t = useI18n();
  const { showAlert } = useAlert();

  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation(id);
  const deleteTranslation = useDeleteTranslation(id);

  const { data: languages, isLoading, error } = useLanguages();

  const [sourceLanguageCode, setSourceLanguageCode] = useState<string | null>(
    currentSourceLanguageCode,
  );
  const [translationLanguageCode, setTranslationLanguageCode] = useState<
    string | null
  >(currentTranslationLanguageCode);
  const [word, setWord] = useState<string>(currentWord);
  const [translation, setTranslation] = useState<string>(
    currentTranslationList.length === 1 ? currentTranslationList[0] : "",
  );
  const [translationList, setTranslationList] = useState<string[]>(
    currentTranslationList.length > 1 ? currentTranslationList : [],
  );
  const [knowledgeLevel, setKnowledgeLevel] = useState<number[]>([0]);
  const [definition, setDefinition] = useState<string>(currentDefinition);

  useEffect(() => {
    setSourceLanguageCode(languages?.[0]?.code ?? null);
    setTranslationLanguageCode(languages?.[1]?.code ?? null);
  }, [languages]);

  const resetForm = () => {
    setWord("");
    setTranslation("");
    setKnowledgeLevel([0]);
    setSourceLanguageCode(languages?.[0]?.code ?? null);
    setTranslationLanguageCode(languages?.[1]?.code ?? null);
    setTranslationList([]);
    setDefinition("");
  };

  const translationInputOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedTranslation = translation.trim();
      if (trimmedTranslation && !translationList.includes(trimmedTranslation)) {
        setTranslationList([...translationList, trimmedTranslation]);
        setTranslation("");
      }
    }
  };

  const handleSave = async () => {
    if (
      !word ||
      (!translationList.length && !translation) ||
      !sourceLanguageCode ||
      !translationLanguageCode
    ) {
      return;
    }

    const newTranslation = {
      word,
      translations: translationList.length ? translationList : [translation],
      sourceLanguageCode,
      translationLanguageCode,
      definition,
    };

    try {
      if (!editMode) {
        await createTranslation.mutateAsync({
          ...newTranslation,
          knowledgeLevel: knowledgeLevel[0],
        });
        resetForm();
      } else {
        await updateTranslation.mutateAsync(newTranslation);
      }

      onOpenChange(false);
      showAlert({
        title: t("vocabulary.translationSavedSuccessfully"),
        variant: "default",
      });
    } catch (error) {
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

      onOpenChange(false);
      showAlert({
        title: t("vocabulary.translationDeletedSuccessfully"),
        variant: "default",
      });
    } catch (error) {
      showAlert({
        title:
          error.response?.data?.message ||
          t("vocabulary.errorDeletingTranslation"),
        variant: "destructive",
      });
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 lg:px-8">
        <DialogHeader>
          <DialogTitle>
            {!editMode ? t("vocabulary.addWord") : t("vocabulary.editWord")}
          </DialogTitle>
          {!editMode && (
            <DialogDescription>{t("vocabulary.addNewWord")}</DialogDescription>
          )}
        </DialogHeader>

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
                    Enter <IconCornerDownLeft />
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
          <>
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
                className="-mt-4 h-8"
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
          </>
        )}

        <DialogFooter className="w-full">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
