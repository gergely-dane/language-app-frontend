"use client";

import { supabaseClient } from "@/lib/supabase-client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
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

  const login = () => {};
  const logout = () => {};

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
