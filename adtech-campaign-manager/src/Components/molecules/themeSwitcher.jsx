import { useLayoutEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "theme";
const THEMES = {
  light: "light",
  dark: "dark",
};

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === THEMES.light || savedTheme === THEMES.dark) {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.dark
    : THEMES.light;
}

function applyTheme(theme) {
  const isDark = theme === THEMES.dark;

  document.documentElement.classList.toggle(THEMES.dark, isDark);
  document.body.classList.toggle(THEMES.dark, isDark);
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(getPreferredTheme);
  const isDark = theme === THEMES.dark;

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme = isDark ? THEMES.light : THEMES.dark;

    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
