// ─── Auth ────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Lead ────────────────────────────────────────────────────────────────────
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ─── Lead Query ───────────────────────────────────────────────────────────────
export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: 'latest' | 'oldest';
}

// ─── Forms ───────────────────────────────────────────────────────────────────
export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LeadForm {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface StatusCount {
  _id: LeadStatus;
  count: number;
}

export interface SourceCount {
  _id: LeadSource;
  count: number;
}

export interface LeadStats {
  statusCounts: StatusCount[];
  sourceCounts: SourceCount[];
  total: number;
}
