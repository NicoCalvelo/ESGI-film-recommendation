"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/app/_interfaces/user";
import * as AuthService from "@/app/_services/AuthService";

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signUp: (name: string, email: string, password: string) => string | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
  }, []);

  function login(email: string, password: string): string | null {
    const result = AuthService.login(email, password);
    if (typeof result === "string") return result;
    setUser(result);
    return null;
  }

  function signUp(name: string, email: string, password: string): string | null {
    const salt = crypto.randomUUID();
    const saltedPassword = btoa(password + salt);

    const result = AuthService.signUp(name, email, saltedPassword, salt);
    if (typeof result === "string") return result;
    setUser(result);
    return null;
  }

  function logout() {
    AuthService.logout();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, signUp, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}

