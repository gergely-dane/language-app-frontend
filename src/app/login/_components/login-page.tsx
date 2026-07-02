"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAlert } from "@/context/alert-context";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";

export const LoginPage = () => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password)
      .then((data) => {
        if (!data?.data?.user) {
          showAlert({
            title: t("auth.errorLoggingIn"),
            message: t("auth.incorrectEmailOrPassword"),
            variant: "destructive",
          });
          return;
        }

        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Login failed:", err);
        showAlert({
          title: t("auth.errorLoggingIn"),
          message: (err?.message as string) || undefined,
          variant: "destructive",
        });
      });
  };

  return (
    <div className="-mt-[var(--navbar-height)] flex w-full flex-col gap-2 p-4 lg:w-90 lg:p-0">
      <p className="mx-auto text-2xl font-semibold">{t("auth.login")}</p>

      <Separator className="my-2" />

      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label={t("auth.email")}
        type="email"
      />

      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label={t("auth.password")}
        type="password"
      />

      <Button className="mt-2" onClick={handleLogin}>
        {t("auth.login")}
      </Button>
    </div>
  );
};
