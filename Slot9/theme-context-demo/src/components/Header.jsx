import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={`box ${theme}`}>
      <h2>My App</h2>
      <button onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
      </button>
    </header>
  );
}
