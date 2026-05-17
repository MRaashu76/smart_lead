import { ReactNode } from 'react';
import { cn } from '@/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export const StatCard = ({ label, value, icon, iconBg = 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400', trend, className }: StatCardProps) => {
  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-muted)] mb-1">{label}</p>
          <p className="text-2xl font-semibold text-[var(--color-text)]">{value}</p>
          {trend && (
            <p className={cn('text-xs mt-1', trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500')}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl', iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
};
