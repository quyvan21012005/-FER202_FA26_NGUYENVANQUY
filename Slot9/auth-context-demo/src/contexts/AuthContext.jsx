import { createContext, useContext, useState, useMemo, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lazy initializer: chỉ đọc localStorage 1 lần duy nhất khi mount
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((username, password) => {
    // Demo: thực tế sẽ gọi API
    if (username === "admin" && password === "123") {
      const u = { username, role: "admin" };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải nằm trong <AuthProvider>");
  return ctx;
}
