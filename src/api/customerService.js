import http from "./http";
import { getAdminAuthData } from "../utils/storage";

const BASE_URL = "/customers";

// Admin yetkilendirme başlıklarını ekleyen yardımcı fonksiyon
const getAuthHeaders = () => {
  const { username, password } = getAdminAuthData();
  if (!username || !password) return {};
  return {
    Username: username,
    Password: password,
  };
};

// --- READ (Tüm müşteriler) ---
export const getCustomers = async () => {
  const headers = getAuthHeaders();
  return http.get(`${BASE_URL}/getAllCustomers`, { headers });
};

// --- CREATE (Yeni müşteri) ---
export const createCustomer = async (customerData) => {
  const { username, password } = getAdminAuthData();
  const securedRequest = { username, password, customer: customerData };
  const headers = getAuthHeaders();
  return http.post(`${BASE_URL}/createCustomer`, securedRequest, { headers });
};

// --- UPDATE (Müşteri Güncelle) ---
export const updateCustomer = async (id, updatedCustomerData) => {
  const headers = getAuthHeaders();
  return http.put(`${BASE_URL}/updateCustomer/${id}`, updatedCustomerData, { headers });
};

// --- DELETE (Müşteri Sil) ---
export const deleteCustomer = async (id) => {
  const headers = getAuthHeaders();
  return http.delete(`${BASE_URL}/deleteCustomer/${id}`, { headers });
};

// YENİ METOT: Müşteri adına göre arama
export const searchCustomers = async (fullName) => {
    // Admin yetkilendirmesi gereklidir
    const headers = getAuthHeaders(); 
    // Backend'de /api/customers/search?fullName=... endpoint'i olmalı
    return http.get(`/search`, { 
        headers, 
        params: { fullName } 
    });
};