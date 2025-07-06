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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { useLanguages } from "@/hooks/use-languages";
import { LanguageSelector } from "@/components/language-selector";

export default function AddWordDialog() {
  const { data: languages, isLoading, error } = useLanguages();
  const [sourceLanguage, setSourceLanguage] = React.useState<string>(
    languages?.[0]?.code,
  );
  const [translationLanguage, setTranslationLanguage] = React.useState<string>(
    languages?.[1]?.code,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
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
            <Input id="name" className="w-full" placeholder="Enter the word" />
            <LanguageSelector
              value={sourceLanguage}
              onChange={setSourceLanguage}
              languages={languages?.map((lang) => lang.code) || []}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input className="w-full" placeholder="Enter the translation" />
            <LanguageSelector
              value={translationLanguage}
              onChange={setTranslationLanguage}
              languages={languages?.map((lang) => lang.code) || []}
            />
          </div>
        </div>
        <DialogFooter className="flex items-center">
          <Button variant="outline" className="w-30">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
