import { createContext, useContext, useState, useMemo, useCallback } from "react";

// 1. Tạo context. Default = null để phát hiện lỗi quên bọc Provider
const ThemeContext = createContext(null);

// 2. Component Provider: chứa state + logic
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Giữ value ổn định, chỉ đổi khi theme đổi
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// 3. Custom hook: gọn hơn + báo lỗi rõ ràng
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme phải được dùng bên trong <ThemeProvider>");
  }
  return context;
}
