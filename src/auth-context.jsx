import React, { createContext, useContext, useState } from "react";
import { demoUsers } from "./auth-users";

const STORAGE_KEY = "smartlife_auth_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const found = demoUsers.find((u) => u.username === parsed.username);
      return found || null;
    } catch (e) {
      console.error("Failed to parse auth user from storage", e);
      return null;
    }
  });

  const login = (username, password) => {
    const found = demoUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ username: found.username })
      );
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
