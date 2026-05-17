import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, Badge } from '@/components/ui';
import { cn } from '@/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
];

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2.5 px-4 h-14 border-b border-[var(--color-border)]', collapsed && 'justify-center px-0')}>
        <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm text-[var(--color-text)] tracking-tight">Smart Leads</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                  : 'text-[var(--color-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--color-text)]'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      {user && (
        <div className={cn('p-2 border-t border-[var(--color-border)]', collapsed && 'flex flex-col items-center')}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
              <Avatar name={user.name} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--color-text)] truncate">{user.name}</p>
                <Badge variant={user.role === 'admin' ? 'primary' : 'default'} className="mt-0.5">
                  {user.role}
                </Badge>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Log out"
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors',
              collapsed && 'justify-center px-0'
            )}
          >
            <LogOut size={16} />
            {!collapsed && 'Log out'}
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors shadow-sm"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};
