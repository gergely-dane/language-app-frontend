import { LanguageSelector } from "@/components/language-selector";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguages } from "@/hooks/use-languages";
import { useCreateTranslation } from "@/hooks/use-translations";
import { useAlert } from "@/lib/alert-context";
import { IconHelp, IconPlus } from "@tabler/icons-react";
import React, { useEffect } from "react";

export default function AddWordDialog() {
  const { data: languages, isLoading, error } = useLanguages();
  const createTranslation = useCreateTranslation();
  const { showAlert } = useAlert();

  const [sourceLanguageCode, setSourceLanguageCode] = React.useState<string>();
  const [translationLanguageCode, setTranslationLanguageCode] =
    React.useState<string>();
  const [word, setWord] = React.useState<string>("");
  const [translation, setTranslation] = React.useState<string>("");
  const [knowledgeLevel, setKnowledgeLevel] = React.useState<number[]>([0]);

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
              value={sourceLanguageCode}
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
              value={translationLanguageCode}
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
