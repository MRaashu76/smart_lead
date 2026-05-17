import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads.api';
import { LeadFilters, LeadForm } from '@/types';
import toast from 'react-hot-toast';

export const LEADS_KEY = 'leads';
export const STATS_KEY = 'lead-stats';

export const useLeads = (filters: Partial<LeadFilters>) => {
  return useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
    select: (res) => res.data,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: () => leadsApi.getLead(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: [STATS_KEY],
    queryFn: () => leadsApi.getStats(),
    select: (res) => res.data,
  });
};

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadForm) => leadsApi.createLead(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Lead created successfully!');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadForm> }) =>
      leadsApi.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Lead updated successfully!');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Lead deleted!');
    },
    onError: () => toast.error('Failed to delete lead'),
  });
};

export const useExportLeads = () => {
  return useMutation({
    mutationFn: () => leadsApi.exportCSV(),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    },
    onError: () => toast.error('Export failed'),
  });
};
