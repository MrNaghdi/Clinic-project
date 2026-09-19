import { useEffect, useState } from "react";

const getInitial = () =>
  typeof window !== "undefined" &&
  localStorage.getItem("darkMode") === "true";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(getInitial);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    window.dispatchEvent(new Event("darkModeChange"));
  }, [darkMode]);

  useEffect(() => {
    const handler = () => setDarkMode(getInitial());
    window.addEventListener("darkModeChange", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("darkModeChange", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggleDarkMode = () => setDarkMode((p) => !p);

  return { darkMode, toggleDarkMode };
}