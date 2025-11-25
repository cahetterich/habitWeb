"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // carrega usuário salvo no localStorage (se houver)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("habitflow:user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      }
    } catch (err) {
      console.error("Erro ao ler usuário do localStorage", err);
    } finally {
      setInitialized(true);
    }
  }, []);

  function login(data) {
    setUser(data);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("habitflow:user", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Erro ao salvar usuário no localStorage", err);
    }
  }

  function logout() {
    setUser(null);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("habitflow:user");
      }
    } catch {
      // silencioso
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading: !initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
