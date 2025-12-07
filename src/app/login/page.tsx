"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/hooks/use-i18n";
import React, { useState } from "react";

const LoginPage = () => {
  const t = useI18n();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex flex-col gap-2 p-4 w-full -mt-[var(--navbar-height)] lg:w-90 lg:p-0">
      <p className="text-2xl font-semibold mx-auto">{t("general.login")}</p>

      <Separator className="my-2" />

      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label={t("general.email")}
        type="email"
      />

      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label={t("general.password")}
        type="password"
      />

      <Button className="mt-2" onClick={handleLogin}>
        {t("general.signIn")}
      </Button>
    </div>
  );
};

export default LoginPage;
