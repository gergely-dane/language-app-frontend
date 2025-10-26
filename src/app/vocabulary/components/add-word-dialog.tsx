import { LanguageSelector } from "@/app/vocabulary/components/language-selector";
import { useCreateTranslation } from "@/app/vocabulary/hooks";
import { InputWithKbd } from "@/components/input-with-kbd";
import { MultiSelectChipList } from "@/components/multi-select-chip-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguages } from "@/hooks/languages-hooks";
import { useI18n } from "@/hooks/use-i18n";
import { useAlert } from "@/lib/alert-context";
import { IconCornerDownLeft, IconHelp, IconPlus } from "@tabler/icons-react";
import { KeyboardEvent, useEffect, useState } from "react";

export function AddWordDialog() {
  const t = useI18n();

  const { data: languages, isLoading, error } = useLanguages();
  const createTranslation = useCreateTranslation();
  const { showAlert } = useAlert();

  const [sourceLanguageCode, setSourceLanguageCode] = useState<string | null>(
    "",
  );
  const [translationLanguageCode, setTranslationLanguageCode] = useState<
    string | null
  >("");
  const [word, setWord] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [translationList, setTranslationList] = useState<string[]>([]);
  const [knowledgeLevel, setKnowledgeLevel] = useState<number[]>([0]);
  const [definition, setDefinition] = useState<string>("");

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
    resetForm();

    try {
      await createTranslation.mutateAsync({
        word,
        translations: translationList.length ? translationList : [translation],
        sourceLanguageCode,
        translationLanguageCode,
        knowledgeLevel: knowledgeLevel[0],
        definition,
      });

      showAlert({
        title: "Translation added successfully",
        variant: "default",
      });
    } catch (error: any) {
      showAlert({
        title: error.response?.data?.message || "Error adding translation",
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconPlus />
          <span className="hidden lg:block">{t("vocabulary.addWord")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-4 lg:px-8">
        <DialogHeader>
          <DialogTitle>{t("vocabulary.addWord")}</DialogTitle>
          <DialogDescription>{t("vocabulary.addNewWord")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
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

        <DialogFooter className="flex items-center">
          <DialogClose className="w-full" asChild>
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
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
