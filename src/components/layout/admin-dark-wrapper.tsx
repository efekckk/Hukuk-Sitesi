"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface DarkModeContextType {
  isDark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDark: false,
  toggle: () => {},
});

export function useDarkMode() {
  return useContext(DarkModeContext);
}

export function AdminDarkWrapper({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-dark-mode");
    const t = setTimeout(() => {
      if (stored === "true") setIsDark(true);
      setMounted(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("admin-dark-mode", String(isDark));
    }
  }, [isDark, mounted]);

  const toggle = () => setIsDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      <div className={isDark ? "dark" : ""}>
        {children}
      </div>
    </DarkModeContext.Provider>
  );
}
