// API Configuration
const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/auth/admin/login`,

  // Employee endpoints
  EMPLOYEES: `${API_BASE_URL}/employees`,
  EMPLOYEE: (id) => `${API_BASE_URL}/employees/${id}`,

  // Order endpoints
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER: (id) => `${API_BASE_URL}/orders/${id}`,
  ORDERS_BY_EMPLOYEE: `${API_BASE_URL}/orders/employee`,
  CREATE_ORDER_BY_ADMIN: `${API_BASE_URL}/orders/admin`,
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT: (id) => `${API_BASE_URL}/products/${id}`,
};