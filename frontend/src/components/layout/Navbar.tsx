import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';

interface NavbarProps {
  title: string;
}

export const Navbar = ({ title }: NavbarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0">
      <h1 className="text-sm font-semibold text-[var(--color-text)]">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--color-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          className="p-2 rounded-lg text-[var(--color-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>

        {user && (
          <div className="flex items-center gap-2 ml-1 pl-3 border-l border-[var(--color-border)]">
            <Avatar name={user.name} size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-[var(--color-text)] leading-none">{user.name}</p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
