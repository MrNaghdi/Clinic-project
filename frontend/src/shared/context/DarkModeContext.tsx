import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
  } from "react";
  
  type DarkModeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
  };
  
  const DarkModeContext = createContext<DarkModeContextType | null>(null);
  
  export function DarkModeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState<boolean>(
      () => localStorage.getItem("darkMode") === "true"
    );
  
    useEffect(() => {
      localStorage.setItem("darkMode", String(darkMode));
    }, [darkMode]);
  
    const toggleDarkMode = () => setDarkMode((prev) => !prev);
  
    return (
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    );
  }
  
  export function useDarkMode() {
    const ctx = useContext(DarkModeContext);
    if (!ctx)
      throw new Error("useDarkMode must be used inside DarkModeProvider");
    return ctx;
  }