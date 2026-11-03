import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
  } from "react";
  import type { AuthUser } from "../types";
  import { fetchMe } from "../api/auth.api";
  
  interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    setUser: (u: AuthUser | null) => void;
    refresh: () => Promise<void>;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);
  
  const TOKEN_KEY = "access_token";
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
  
    const refresh = useCallback(async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        setUser(me);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      refresh();
    }, [refresh]);
  
    const logout = useCallback(() => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, loading, setUser, refresh, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
      throw new Error("useAuth باید داخل AuthProvider استفاده شود");
    }
    return ctx;
  }