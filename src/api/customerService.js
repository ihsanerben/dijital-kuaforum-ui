// src/api/customerService.js - ROTA DÜZELTİLMİŞTİR

import http from "./http";
import { getAdminAuthData } from "../utils/storage";

// FAZLADAN /API KALDIRILDI. SADECE /API/CUSTOMERS OLMASI İÇİN BASE_URL DÜZELTİLDİ.
const BASE_URL = "/customers"; 

// Admin yetkilendirme başlıklarını ekleyen yardımcı fonksiyon
const getAuthHeaders = () => {
  const { username, password } = getAdminAuthData();
  if (!username || !password) {
    return {};
  }
  return {
    Username: username,
    Password: password,
  };
};

// --- READ (Admin: Tüm müşterileri listele) ---
export const getCustomers = async () => {
  const headers = getAuthHeaders();
  // Burada BASE_URL kullanılarak URL: /customers/getAllCustomers olacak
  return http.get(`${BASE_URL}/getAllCustomers`, { headers }); 
};

// --- CREATE (Admin: Yeni müşteri oluştur) ---
export const createCustomer = async (customerData) => {
  const headers = getAuthHeaders();
  
  // Örnek: Eğer backendiniz SecureCustomerRequestDTO kullanıyorsa
  const { username, password } = getAdminAuthData();
  const securedRequest = {
      username: username,
      password: password,
      customer: customerData // Formdan gelen müşteri verisi
  };
  
  // URL: /customers/createCustomer olacak
  return http.post(`${BASE_URL}/createCustomer`, securedRequest, { headers: headers }); 
};


// --- UPDATE (Admin: Müşteriyi Güncelle) ---
export const updateCustomer = async (id, updatedCustomerData) => {
  const headers = getAuthHeaders();
  return http.put(`${BASE_URL}/updateCustomer/${id}`, updatedCustomerData, { headers });
};

// --- DELETE (Admin: Müşteriyi Sil) ---
export const deleteCustomer = async (id) => {
  const headers = getAuthHeaders();
  return http.delete(`${BASE_URL}/deleteCustomer/${id}`, { headers });
};