/**
 * API configuration and utility functions for connecting to the Flask backend
 */

// API base URL - adjust this based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface ApiTicket {
  ticket_id: number;
  author_id: number;
  assignee_id: number | null;
  department: number;
  department_name?: string | null;
  priority: number | null;
  subject: string;
  message: string;
  status: number; // 0: CLOSED, 1: OPEN, 2: AWAITING_AUTHOR, 3: AWAITING_ASSIGNEE
  created_at: string;
  last_updated: string;
  author_name?: string | null;
  assignee_name?: string | null;
}

export interface ApiUser {
  user_id: number;
  email: string;
  display_name: string;
  role: string;
  created_at: string | null;
  major_id: number | null;
  minor_id: number | null;
  department_id: number | null;
}

export interface TicketsResponse {
  tickets: ApiTicket[];
  page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

/**
 * Make an API request with proper error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for session management
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all tickets with optional filters
 */
export async function getTickets(params?: {
  page?: number;
  per_page?: number;
  status?: number;
  department?: number;
  priority?: number;
  created?: string;
  updated?: string;
  text?: string;
}): Promise<TicketsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = `/api/get_tickets${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<TicketsResponse>(endpoint);
}

/**
 * Submit a new ticket
 */
export async function submitTicket(data: {
  department: number;
  subject: string;
  message: string;
}): Promise<{ message: string; ticket: ApiTicket }> {
  return apiRequest<{ message: string; ticket: ApiTicket }>('/api/submit_ticket', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Login a user (sets session cookie)
 */
export async function login(userId: number): Promise<void> {
  // Note: This endpoint redirects, so we handle it differently
  await fetch(`${API_BASE_URL}/login/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<ApiUser | null> {
  try {
    return await apiRequest<ApiUser>('/api/current_user');
  } catch {
    return null;
  }
}
