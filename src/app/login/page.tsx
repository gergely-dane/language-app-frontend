"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAlert } from "@/context/alert-context";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const t = useI18n();
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password).then((data) => {
      if (!data?.data?.user) {
        showAlert({
          title: t("auth.errorLoggingIn"),
          message: t("auth.incorrectEmailOrPassword"),
          variant: "destructive",
        });
        return;
      }

      router.push("/");
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 w-full -mt-[var(--navbar-height)] lg:w-90 lg:p-0">
      <p className="text-2xl font-semibold mx-auto">{t("auth.login")}</p>

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

export default LoginPage;
