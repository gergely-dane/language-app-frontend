import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { useLanguages } from "@/hooks/use-languages";
import { LanguageSelector } from "@/components/language-selector";
import { useCreateTranslation } from "@/hooks/use-translations";
import { useAlert } from "@/lib/alert-context";

export default function AddWordDialog() {
  const { data: languages, isLoading, error } = useLanguages();
  const createTranslation = useCreateTranslation();
  const { showAlert } = useAlert();

  const [sourceLanguage, setSourceLanguage] = React.useState<string>();
  const [translationLanguage, setTranslationLanguage] =
    React.useState<string>();
  const [word, setWord] = React.useState<string>("");
  const [translation, setTranslation] = React.useState<string>("");

  useEffect(() => {
    setSourceLanguage(languages?.[0]?.code);
    setTranslationLanguage(languages?.[1]?.code);
  }, [languages]);

  const handleSave = async () => {
    if (!word || !translation || !sourceLanguage || !translationLanguage) {
      return;
    }

    try {
      await createTranslation.mutateAsync({
        word,
        translation,
        sourceLanguage,
        translationLanguage,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add word</DialogTitle>
          <DialogDescription>
            Add a new word to your vocabulary.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        <DialogFooter className="flex items-center">
          <Button
            variant="outline"
            className="mx-auto w-30"
            disabled={createTranslation.isPending}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
