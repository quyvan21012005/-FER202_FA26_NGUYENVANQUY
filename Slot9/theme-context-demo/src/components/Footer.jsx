import { useTheme } from "../contexts/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  return <footer className={`box ${theme}`}>© 2026 FER202</footer>;
}
