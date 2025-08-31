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
import { Button } from "@/components/ui/button";
import { IconHelp, IconPlus } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { useLanguages } from "@/hooks/use-languages";
import { LanguageSelector } from "@/components/language-selector";
import { useCreateTranslation } from "@/hooks/use-translations";
import { useAlert } from "@/lib/alert-context";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AddWordDialog() {
  const { data: languages, isLoading, error } = useLanguages();
  const createTranslation = useCreateTranslation();
  const { showAlert } = useAlert();

  const [sourceLanguage, setSourceLanguage] = React.useState<string>();
  const [translationLanguage, setTranslationLanguage] =
    React.useState<string>();
  const [word, setWord] = React.useState<string>("");
  const [translation, setTranslation] = React.useState<string>("");
  const [knowledgeLevel, setKnowledgeLevel] = React.useState<number[]>([0]);

  useEffect(() => {
    setSourceLanguage(languages?.[0]?.code);
    setTranslationLanguage(languages?.[1]?.code);
  }, [languages]);

  const resetForm = () => {
    setWord("");
    setTranslation("");
    setKnowledgeLevel([0]);
    setSourceLanguage(languages?.[0]?.code);
    setTranslationLanguage(languages?.[1]?.code);
  };

  const handleSave = async () => {
    if (!word || !translation || !sourceLanguage || !translationLanguage) {
      return;
    }
    resetForm();

    try {
      await createTranslation.mutateAsync({
        word,
        translation,
        sourceLanguage,
        translationLanguage,
        knowledgeLevel: knowledgeLevel[0],
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
      if (value === sourceLanguage) {
        setSourceLanguage(translationLanguage);
      }
      setTranslationLanguage(value);
    } else {
      if (value === translationLanguage) {
        setTranslationLanguage(sourceLanguage);
      }
      setSourceLanguage(value);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconPlus />
          <span className="hidden lg:block">Add Word</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-4 lg:px-8">
        <DialogHeader>
          <DialogTitle>Add word</DialogTitle>
          <DialogDescription>
            Add a new word to your vocabulary.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Input
              id="name"
              className="w-full"
              placeholder="Enter the word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <LanguageSelector
              value={sourceLanguage}
              onChange={(value) => handleLanguageChange(value, false)}
              languages={languages?.map((lang) => lang.code) || []}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="w-full"
              placeholder="Enter the translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            />
            <LanguageSelector
              value={translationLanguage}
              onChange={(value) => handleLanguageChange(value, true)}
              languages={languages?.map((lang) => lang.code) || []}
            />
          </div>
        </div>

        <div className="flex">
          <Label>How well do you know the word?</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconHelp size={18} className="text-muted-foreground ml-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust the slider according to your knowledge level</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Slider
            value={knowledgeLevel}
            onValueChange={setKnowledgeLevel}
            min={0}
            max={4}
            step={1}
            className="-mt-4 h-6"
          />
          <div className="-mt-1 flex text-xs">
            <div>Just learned it</div>
            <div className="ml-auto">Know it very well</div>
          </div>
        </div>

        <DialogFooter className="flex items-center">
          <DialogClose asChild className="w-full">
            <Button
              variant="outline"
              className="mx-auto w-30"
              disabled={createTranslation.isPending || !word || !translation}
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
