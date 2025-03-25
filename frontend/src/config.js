// API Configuration
const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}`,

  // Employee endpoints
  GET_EMPLOYEE_PRODUCTS: `${API_BASE_URL}/products`,
  CREATE_ORDER_BY_EMPLOYEE: `${API_BASE_URL}/orders`,
  EDIT_ORDER_BY_EMPLOYEE: `${API_BASE_URL}/orders`,
  EDIT_ORDER_STATUS_BY_EMPLOYEE: (id) => `${API_BASE_URL}/orders/${id}/status`,
  GET_ORDERS_BY_EMPLOYEE: `${API_BASE_URL}/orders/employee`,

  // Admin endpoints
  GET_ADMIN_PRODUCTS: `${API_BASE_URL}/products`,
  GET_EMPLOYEES_BY_ADMIN: `${API_BASE_URL}/employees`,
  GET_ORDERS_BY_ADMIN: `${API_BASE_URL}/orders`,
  EDIT_ORDER_STATUS_BY_ADMIN: (id) => `${API_BASE_URL}/orders/${id}/status`,
  EDIT_ORDERS_BY_ADMIN: `${API_BASE_URL}/orders`,
  CREATE_EMPLOYEE_BY_ADMIN: `${API_BASE_URL}/employees`,
  UPDATE_EMPLOYEE: (id) => `${API_BASE_URL}/employees/${id}`,
  UPDATE_EMPLOYEE_STATUS: (id) => `${API_BASE_URL}/employees/${id}/status`,
  CREATE_ORDER_BY_ADMIN: `${API_BASE_URL}/orders/admin`,
  
  // Product endpoints
  GET_PRODUCTS: `${API_BASE_URL}/products`,
  EDIT_PRODUCT: (id) => `${API_BASE_URL}/products/${id}`,
  CREATE_PRODUCTS: `${API_BASE_URL}/products`,
  DELETE_PRODUCT: (id) => `${API_BASE_URL}/products/${id}`,

  // Order endpoints
  GET_ORDER_DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,
};