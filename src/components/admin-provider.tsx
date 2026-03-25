"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

type AdminCtx = {
  isAdmin: boolean;
  token: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
};

const AdminContext = createContext<AdminCtx>({
  isAdmin: false,
  token: null,
  login: async () => false,
  logout: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // Read token from localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (stored) setToken(stored);
  }, []);

  const login = useCallback(async (password: string) => {
    // Verify token works by making a test request
    const res = await fetch("/api/reviews/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ content: "" }),
    });
    if (res.ok) {
      localStorage.setItem("admin_token", password);
      setToken(password);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin: !!token, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
