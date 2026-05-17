import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Mail, Calendar, Globe } from 'lucide-react';
import { useLead, useUpdateLead, useDeleteLead } from '@/hooks/useLeads';
import { StatusBadge, SourceBadge, Avatar, Spinner, ConfirmDialog, Modal } from '@/components/ui';
import { LeadForm } from '@/components/leads/LeadForm';
import { formatDateTime } from '@/utils';
import { LeadForm as LeadFormType } from '@/types';

const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: lead, isLoading } = useLead(id ?? '');
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const handleUpdate = (formData: Partial<LeadFormType>) => {
    if (!id) return;
    updateLead({ id, data: formData }, { onSuccess: () => setIsEditing(false) });
  };

  const handleDelete = () => {
    if (!id) return;
    deleteLead(id, { onSuccess: () => navigate('/leads') });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-muted)]">Lead not found.</p>
        <button onClick={() => navigate('/leads')} className="btn-secondary mt-4">Go back</button>
      </div>
    );
  }

  const creatorName = typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <div className="max-w-2xl space-y-4">
      {/* Back */}
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <ArrowLeft size={15} /> Back to Leads
      </button>

      {/* Card */}
      <div className="card p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} size="lg" />
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">{lead.name}</h2>
              <p className="text-sm text-[var(--color-muted)]">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              <Pencil size={14} /> Edit
            </button>
            <button onClick={() => setIsDeleteOpen(true)} className="btn-danger">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-6">
          <StatusBadge status={lead.status} />
          <SourceBadge source={lead.source} />
        </div>

        {/* Details */}
        <div className="space-y-3 border-t border-[var(--color-border)] pt-5">
          <DetailRow icon={<Mail size={15} />} label="Email" value={lead.email} />
          <DetailRow icon={<Globe size={15} />} label="Source" value={lead.source} />
          <DetailRow icon={<Calendar size={15} />} label="Created" value={formatDateTime(lead.createdAt)} />
          <DetailRow icon={<Calendar size={15} />} label="Updated" value={formatDateTime(lead.updatedAt)} />
          <DetailRow icon={<Globe size={15} />} label="Added by" value={creatorName} />
        </div>

        {lead.notes && (
          <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
            <p className="text-xs font-medium text-[var(--color-muted)] mb-2">Notes</p>
            <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Lead">
        <LeadForm
          defaultValues={lead}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isLoading={isUpdating}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this lead?"
        description={`"${lead.name}" will be permanently removed.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[var(--color-muted)] w-4 flex-shrink-0">{icon}</span>
    <span className="text-xs text-[var(--color-muted)] w-20 flex-shrink-0">{label}</span>
    <span className="text-sm text-[var(--color-text)]">{value}</span>
  </div>
);

export default LeadDetailPage;
