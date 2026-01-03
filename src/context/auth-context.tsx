"use client";

import { supabaseClient } from "@/lib/supabase-client";
import { AuthTokenResponsePassword, User } from "@supabase/auth-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextProps = {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<AuthTokenResponsePassword>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsAuthenticated(!!user);
    });

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    return supabaseClient.auth.signInWithPassword({ email, password });
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
