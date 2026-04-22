import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg border border-white/20 dark:border-white/20 
                 bg-black/20 dark:bg-white/10 
                 text-black dark:text-white 
                 hover:bg-black/30 dark:hover:bg-white/20 
                 transition"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default ThemeToggle;