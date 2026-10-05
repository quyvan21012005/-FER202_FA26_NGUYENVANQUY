import { useTheme } from "../contexts/ThemeContext";

export default function Content() {
  const { theme } = useTheme();
  return (
    <main className={`box ${theme}`}>
      <p>Giao diện hiện tại: <b>{theme}</b></p>
    </main>
  );
}
