// Admin-related TypeScript types

export interface Admin {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AdminSession {
  id: string;
  admin_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export interface AdminLog {
  id: string;
  admin_id: string | null;
  action: string;
  resource: string | null;
  details: string | null;
  ip_address: string | null;
  created_at: Date;
}

export interface AdminWithSession extends Admin {
  session?: AdminSession;
}

export interface LoginResponse {
  success: boolean;
  admin?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  admin?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFromOrders {
  email: string;
  name: string;
  phone: string;
  total_orders: number;
  last_order_date: Date | null;
}

