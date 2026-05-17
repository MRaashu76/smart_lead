import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { LeadFilters as LeadFiltersType, LeadStatus, LeadSource } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils';

interface LeadFiltersProps {
  filters: Partial<LeadFiltersType>;
  onChange: (filters: Partial<LeadFiltersType>) => void;
}

export const LeadFilters = ({ filters, onChange }: LeadFiltersProps) => {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch]);

  const hasActiveFilters = filters.status || filters.source || filters.search || filters.sort === 'oldest';

  const clearAll = () => {
    setSearchInput('');
    onChange({ page: 1, limit: 10, sort: 'latest' });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className={cn('input-base pl-8 pr-8')}
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => onChange({ ...filters, status: (e.target.value as LeadStatus) || undefined, page: 1 })}
        className="input-base w-auto"
      >
        <option value="">All Statuses</option>
        {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Source filter */}
      <select
        value={filters.source ?? ''}
        onChange={(e) => onChange({ ...filters, source: (e.target.value as LeadSource) || undefined, page: 1 })}
        className="input-base w-auto"
      >
        <option value="">All Sources</option>
        {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Sort */}
      <select
        value={filters.sort ?? 'latest'}
        onChange={(e) => onChange({ ...filters, sort: e.target.value as 'latest' | 'oldest', page: 1 })}
        className="input-base w-auto"
      >
        <option value="latest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      {/* Clear */}
      {hasActiveFilters && (
        <button onClick={clearAll} className="btn-secondary gap-1.5 whitespace-nowrap">
          <X size={13} /> Clear
        </button>
      )}
    </div>
  );
};
