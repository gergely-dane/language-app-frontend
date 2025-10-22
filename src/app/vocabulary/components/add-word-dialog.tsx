import { LanguageSelector } from "@/app/vocabulary/components/language-selector";
import { useCreateTranslation } from "@/app/vocabulary/hooks";
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
import { IconHelp, IconPlus } from "@tabler/icons-react";
import React, { useEffect } from "react";

export function AddWordDialog() {
  const t = useI18n();

  const { data: languages, isLoading, error } = useLanguages();
  const createTranslation = useCreateTranslation();
  const { showAlert } = useAlert();

  const [sourceLanguageCode, setSourceLanguageCode] = React.useState<string>();
  const [translationLanguageCode, setTranslationLanguageCode] =
    React.useState<string>();
  const [word, setWord] = React.useState<string>("");
  const [translation, setTranslation] = React.useState<string>("");
  const [knowledgeLevel, setKnowledgeLevel] = React.useState<number[]>([0]);
  const [definition, setDefinition] = React.useState<string>("");

  useEffect(() => {
    setSourceLanguageCode(languages?.[0]?.code);
    setTranslationLanguageCode(languages?.[1]?.code);
  }, [languages]);

  const resetForm = () => {
    setWord("");
    setTranslation("");
    setKnowledgeLevel([0]);
    setSourceLanguageCode(languages?.[0]?.code);
    setTranslationLanguageCode(languages?.[1]?.code);
    setDefinition("");
  };

  const handleSave = async () => {
    if (
      !word ||
      !translation ||
      !sourceLanguageCode ||
      !translationLanguageCode
    ) {
      return;
    }
    resetForm();

    try {
      await createTranslation.mutateAsync({
        word,
        translation,
        sourceLanguageCode,
        translationLanguageCode,
        knowledgeLevel: knowledgeLevel[0],
        definition,
      });

      showAlert({
        title: "Translation added successfully",
        variant: "default",
      });
    } catch (error) {
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
              className="w-full"
              id="name"
              placeholder={t("vocabulary.enterTheWord")}
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />

            <LanguageSelector
              value={sourceLanguageCode}
              onChange={(value) => handleLanguageChange(value, false)}
              languages={languages?.map((lang) => lang.code) || []}
            />
          </div>

          <div className="flex items-center gap-2">
            <Input
              className="w-full"
              placeholder={t("vocabulary.enterTheTranslation")}
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            />

            <LanguageSelector
              value={translationLanguageCode}
              onChange={(value) => handleLanguageChange(value, true)}
              languages={languages?.map((lang) => lang.code) || []}
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
              disabled={createTranslation.isPending || !word || !translation}
            >
              {t("general.save")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
