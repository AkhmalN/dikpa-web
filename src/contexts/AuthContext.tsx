import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser, LoginPayload } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        // Sets Authorization header via apiClient interceptor
        const userData = await authService.me();
        setToken(storedToken);
        setUser(userData);
      } catch {
        // Token invalid/expired & refresh failed → clear
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const handleAuthLogout = () => logout();
    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [logout]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const tokens = await authService.login(payload);
      localStorage.setItem("access_token", tokens.access_token);
      if (tokens.refresh_token) {
        localStorage.setItem("refresh_token", tokens.refresh_token);
      }
      const userData = await authService.me();
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(tokens.access_token);
      setUser(userData);
      navigate("/dashboard", { replace: true });
    },
    [navigate],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
