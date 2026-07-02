"use client";

import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/context/alert-context";
import { useGetUser } from "@/features/user/api/get-user";
import { useUpdateUser } from "@/features/user/api/update-user";
import { useI18n } from "@/hooks/use-i18n";

export default function SettingsPage() {
  const t = useI18n();
  const { showAlert } = useAlert();

  const { data: user, isLoading } = useGetUser();
  const updateUser = useUpdateUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync({ firstName, lastName });
      showAlert({
        title: t("settings.success"),
        variant: "default",
      });
    } catch (error) {
      showAlert({
        title: t("settings.error"),
        variant: "destructive",
      });
      console.error(error);
    }
  };

  if (isLoading) {
    return <p className="p-4">{t("settings.loading")}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">{t("settings.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.profile")}</CardTitle>
          <CardDescription>{t("settings.profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">{t("settings.firstName")}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={updateUser.isPending}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">{t("settings.lastName")}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={updateUser.isPending}
              />
            </div>

            <Button
              type="submit"
              className="mt-2 w-20"
              disabled={updateUser.isPending}
              isLoading={updateUser.isPending}
            >
              <IconCheck className="mt-0.5 h-4 w-4" />
              {t("settings.save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
