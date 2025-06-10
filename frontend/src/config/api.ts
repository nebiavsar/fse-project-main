const API_BASE_URL = 'http://localhost:8081';

export const API_ENDPOINTS = {
  TABLES: {
    BASE: `${API_BASE_URL}/Tables`,
    BY_ID: (id: number) => `${API_BASE_URL}/Tables/${id}`,
    BY_WAITER: (waiterId: number) => `${API_BASE_URL}/Tables/byWaiter/${waiterId}`,
    CREATE: `${API_BASE_URL}/Tables`,
  },
  WAITERS: {
    BASE: `${API_BASE_URL}/Waiters`,
    BY_ID: (id: number) => `${API_BASE_URL}/Waiters/${id}`,
    CREATE: `${API_BASE_URL}/Waiters`,
  },
  ORDERS: {
    BASE: `${API_BASE_URL}/Orders`,
    BY_ID: (id: number) => `${API_BASE_URL}/Orders/${id}`,
    BY_TABLE: (tableId: number) => `${API_BASE_URL}/Orders/table/${tableId}`,
    CREATE: `${API_BASE_URL}/Orders`,
  },
  CARDS: {
    BASE: `${API_BASE_URL}/Cards`,
    BY_ID: (id: number) => `${API_BASE_URL}/Cards/${id}`,
    CREATE: `${API_BASE_URL}/Cards`,
  }
} as const; 