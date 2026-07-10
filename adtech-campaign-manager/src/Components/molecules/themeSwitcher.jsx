import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");

  
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex items-center inline-flex gap-2 rounded-lg border p-1 bg-white shadow">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md ${
          theme === "light"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        <Sun size={20} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md ${
          theme === "dark"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        <Moon size={20} />
      </button>
    </div>
  );
}