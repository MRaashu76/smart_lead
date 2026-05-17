import { StatusCount } from '@/types';
import { STATUS_DOT_COLORS } from '@/constants';
import { LeadStatus } from '@/types';
import { cn } from '@/utils';

interface StatusDistributionProps {
  statusCounts: StatusCount[];
  total: number;
}

export const StatusDistribution = ({ statusCounts, total }: StatusDistributionProps) => {
  const getCount = (status: LeadStatus) =>
    statusCounts.find((s) => s._id === status)?.count ?? 0;

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];

  const barColors: Record<LeadStatus, string> = {
    New: 'bg-blue-500',
    Contacted: 'bg-amber-500',
    Qualified: 'bg-emerald-500',
    Lost: 'bg-red-500',
  };

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Lead Status Breakdown</h3>

      {/* Stacked bar */}
      {total > 0 && (
        <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-0.5">
          {statuses.map((s) => {
            const count = getCount(s);
            const pct = total ? (count / total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={s}
                className={cn('h-full rounded-full', barColors[s])}
                style={{ width: `${pct}%` }}
                title={`${s}: ${count}`}
              />
            );
          })}
        </div>
      )}

      <div className="space-y-2.5">
        {statuses.map((status) => {
          const count = getCount(status);
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', STATUS_DOT_COLORS[status])} />
                <span className="text-xs text-[var(--color-text)]">{status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--color-text)]">{count}</span>
                <span className="text-xs text-[var(--color-muted)] w-8 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <p className="text-xs text-[var(--color-muted)] text-center py-4">No leads yet</p>
      )}
    </div>
  );
};
