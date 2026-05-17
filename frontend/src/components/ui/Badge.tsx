import { LeadStatus, LeadSource } from '@/types';
import { STATUS_COLORS, STATUS_DOT_COLORS, SOURCE_ICONS } from '@/constants';
import { cn } from '@/utils';

interface StatusBadgeProps {
  status: LeadStatus;
  showDot?: boolean;
}

export const StatusBadge = ({ status, showDot = true }: StatusBadgeProps) => {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', STATUS_COLORS[status])}>
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT_COLORS[status])} />}
      {status}
    </span>
  );
};

interface SourceBadgeProps {
  source: LeadSource;
}

export const SourceBadge = ({ source }: SourceBadgeProps) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
      <span>{SOURCE_ICONS[source]}</span>
      {source}
    </span>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    primary: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
};
