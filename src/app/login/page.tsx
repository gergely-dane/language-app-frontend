"use client";

import { useAuth } from "@/context/auth-context";
import { useState } from "react";

const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Login</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await login(email, password);
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;
