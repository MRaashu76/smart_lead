import axiosInstance from './axiosInstance';
import { ApiResponse, Lead, LeadFilters, LeadForm, LeadStats, PaginatedData } from '@/types';

export const leadsApi = {
  getLeads: async (filters: Partial<LeadFilters>): Promise<ApiResponse<PaginatedData<Lead>>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        params.set(key, String(val));
      }
    });
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Lead>>>(`/leads?${params}`);
    return res.data;
  },

  getLead: async (id: string): Promise<ApiResponse<Lead>> => {
    const res = await axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: LeadForm): Promise<ApiResponse<Lead>> => {
    const res = await axiosInstance.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: Partial<LeadForm>): Promise<ApiResponse<Lead>> => {
    const res = await axiosInstance.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/leads/${id}`);
    return res.data;
  },

  getStats: async (): Promise<ApiResponse<LeadStats>> => {
    const res = await axiosInstance.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data;
  },

  exportCSV: async (): Promise<Blob> => {
    const res = await axiosInstance.get('/leads/export', { responseType: 'blob' });
    return res.data as Blob;
  },
};
