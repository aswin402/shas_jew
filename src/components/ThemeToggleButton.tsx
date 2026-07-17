import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export function ThemeToggleButton() {
  const { theme, setTheme } = useThemeStore();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const cycleTheme = () => {
    if (isDark) setTheme('light');
    else setTheme('dark');
  };

  return (
    <button
      onClick={cycleTheme}
      title={`Current: ${theme} • Click to toggle`}
      className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-shas-border/40 transition-colors text-shas-heading dark:text-foreground cursor-pointer focus:outline-none"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`absolute h-5 w-5 transition-all duration-300 ${
            !isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`absolute h-5 w-5 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}