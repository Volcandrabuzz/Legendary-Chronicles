import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-800'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}