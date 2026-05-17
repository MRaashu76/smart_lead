import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, ExternalLink, Users } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge, Avatar, EmptyState, ConfirmDialog } from '@/components/ui';
import { formatDate } from '@/utils';
import { useNavigate } from 'react-router-dom';

interface LeadTableProps {
  leads: Lead[];
  isLoading?: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const SkeletonRow = () => (
  <tr className="border-b border-[var(--color-border)]">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

interface RowMenuProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const RowMenu = ({ onEdit, onDelete, onView }: RowMenuProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--color-muted)] transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-40 card shadow-lg py-1 animate-slide-up">
            <button onClick={() => { onView(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-[var(--color-text)] hover:bg-gray-50 dark:hover:bg-gray-800">
              <ExternalLink size={13} /> View details
            </button>
            <button onClick={() => { onEdit(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-[var(--color-text)] hover:bg-gray-50 dark:hover:bg-gray-800">
              <Pencil size={13} /> Edit lead
            </button>
            <div className="my-1 border-t border-[var(--color-border)]" />
            <button onClick={() => { onDelete(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const LeadTable = ({ leads, isLoading, onEdit, onDelete, isDeleting }: LeadTableProps) => {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const cols = ['Lead', 'Email', 'Status', 'Source', 'Created', ''];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {cols.map((c) => (
                <th key={c} className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : leads.length === 0
              ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<Users size={24} />}
                      title="No leads found"
                      description="Try adjusting your filters or add a new lead to get started."
                    />
                  </td>
                </tr>
              )
              : leads.map((lead) => {
                  const creatorName =
                    typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';
                  return (
                    <tr
                      key={lead._id}
                      className="border-b border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={lead.name} size="sm" />
                          <div>
                            <p className="font-medium text-[var(--color-text)] text-xs leading-tight">{lead.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{creatorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted)]">{lead.email}</td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--color-muted)] whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <RowMenu
                          lead={lead}
                          onView={() => navigate(`/leads/${lead._id}`)}
                          onEdit={() => onEdit(lead)}
                          onDelete={() => setDeleteTarget(lead._id)}
                        />
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete lead?"
        description="This lead will be permanently removed. This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
};
