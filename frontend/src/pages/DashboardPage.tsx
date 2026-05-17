import { Link } from 'react-router-dom';
import { Users, CheckCircle, TrendingUp, XCircle, ArrowRight, Plus } from 'lucide-react';
import { useLeadStats, useLeads } from '@/hooks/useLeads';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusDistribution } from '@/components/dashboard/StatusDistribution';
import { StatusBadge, Avatar, Spinner } from '@/components/ui';
import { formatDate } from '@/utils';

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const { data: recentData, isLoading: leadsLoading } = useLeads({ page: 1, limit: 5, sort: 'latest' });

  const getCount = (status: string) =>
    stats?.statusCounts.find((s) => s._id === status)?.count ?? 0;

  const statCards = [
    {
      label: 'Total Leads',
      value: stats?.total ?? 0,
      icon: <Users size={18} />,
      iconBg: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
    },
    {
      label: 'Qualified',
      value: getCount('Qualified'),
      icon: <CheckCircle size={18} />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Contacted',
      value: getCount('Contacted'),
      icon: <TrendingUp size={18} />,
      iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Lost',
      value: getCount('Lost'),
      icon: <XCircle size={18} />,
      iconBg: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-0.5">Here's what's happening with your leads today.</p>
        </div>
        <Link to="/leads" className="btn-primary">
          <Plus size={15} /> Add Lead
        </Link>
      </div>

      {/* Stat cards */}
      {statsLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent leads */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Leads</h3>
            <Link to="/leads" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {leadsLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {recentData?.items.length === 0 && (
                <p className="text-sm text-[var(--color-muted)] text-center py-8">No leads yet.</p>
              )}
              {recentData?.items.map((lead) => (
                <div key={lead._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <Avatar name={lead.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--color-text)] truncate">{lead.name}</p>
                    <p className="text-xs text-[var(--color-muted)] truncate">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={lead.status} showDot={false} />
                    <span className="text-xs text-[var(--color-muted)] hidden sm:block">{formatDate(lead.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status distribution */}
        {stats && (
          <StatusDistribution
            statusCounts={stats.statusCounts}
            total={stats.total}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
