import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Lead, LeadFilters as LeadFiltersType, LeadForm } from '@/types';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useExportLeads } from '@/hooks/useLeads';
import { useAuth } from '@/hooks/useAuth';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadForm as LeadFormComponent } from '@/components/leads/LeadForm';
import { Modal, Pagination } from '@/components/ui';

const INITIAL_FILTERS: Partial<LeadFiltersType> = {
  page: 1,
  limit: 10,
  sort: 'latest',
};

const LeadsPage = () => {
  const [filters, setFilters] = useState<Partial<LeadFiltersType>>(INITIAL_FILTERS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const { data, isLoading } = useLeads(filters);
  const { mutate: createLead, isPending: isCreating } = useCreateLead();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();
  const { mutate: exportCSV, isPending: isExporting } = useExportLeads();
  const { user } = useAuth();

  const handleCreate = (formData: LeadForm) => {
    createLead(formData, { onSuccess: () => setIsCreateOpen(false) });
  };

  const handleUpdate = (formData: Partial<LeadForm>) => {
    if (!editingLead) return;
    updateLead({ id: editingLead._id, data: formData }, { onSuccess: () => setEditingLead(null) });
  };

  const handleDelete = (id: string) => {
    deleteLead(id);
  };

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Leads</h2>
          <p className="text-sm text-[var(--color-muted)] mt-0.5">
            {data?.pagination.total ?? 0} total leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
            <button
              onClick={() => exportCSV()}
              disabled={isExporting}
              className="btn-secondary"
            >
              <Download size={15} />
              {isExporting ? 'Exporting…' : 'Export CSV'}
            </button>
          )}
          <button onClick={() => setIsCreateOpen(true)} className="btn-primary">
            <Plus size={15} /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <LeadFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <LeadTable
          leads={data?.items ?? []}
          isLoading={isLoading}
          onEdit={setEditingLead}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--color-border)]">
            <Pagination
              meta={data.pagination}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Lead"
        size="md"
      >
        <LeadFormComponent
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={isCreating}
          submitLabel="Create Lead"
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
        size="md"
      >
        {editingLead && (
          <LeadFormComponent
            defaultValues={editingLead}
            onSubmit={handleUpdate}
            onCancel={() => setEditingLead(null)}
            isLoading={isUpdating}
            submitLabel="Update Lead"
          />
        )}
      </Modal>
    </div>
  );
};

export default LeadsPage;
