import { Lead } from '@/types';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const exportToCSV = (leads: Lead[], filename = 'leads.csv'): void => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
  const rows = leads.map((lead) => [
    `"${lead.name}"`,
    `"${lead.email}"`,
    lead.status,
    lead.source,
    `"${lead.notes ?? ''}"`,
    formatDate(lead.createdAt),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str: string, length = 30): string => {
  return str.length > length ? str.slice(0, length) + '...' : str;
};
