// Base API URL - would come from environment variables in a real app
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// Toggle between mock and real API (for development)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true;

// Import mock data for development
import { vendors as mockVendors, 
         requisitions as mockRequisitions,
         inventoryItems as mockInventory,
         reports as mockReports } from '../data/mockData';

// Authentication
export const loginUser = async (email, password, role) => {
  if (USE_MOCK_DATA) {
    // Simulate successful login with mock data
    return { success: true, token: 'mock-token-12345', user: { email, role } };
  }
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, role }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return await response.json();
};

// Vendors
export const fetchVendors = async () => {
  if (USE_MOCK_DATA) {
    return mockVendors;
  }
  
  const response = await fetch(`${API_URL}/vendors`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch vendors');
  }
  
  return await response.json();
};

// Requisitions
export const fetchRequisitions = async () => {
  if (USE_MOCK_DATA) {
    return mockRequisitions;
  }
  
  const response = await fetch(`${API_URL}/requisitions`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch requisitions');
  }
  
  return await response.json();
};

// Inventory
export const fetchInventory = async () => {
  if (USE_MOCK_DATA) {
    return mockInventory;
  }
  
  const response = await fetch(`${API_URL}/inventory`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch inventory');
  }
  
  return await response.json();
};

// Reports
export const fetchReports = async () => {
  if (USE_MOCK_DATA) {
    return mockReports;
  }
  
  const response = await fetch(`${API_URL}/reports`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  
  return await response.json();
};