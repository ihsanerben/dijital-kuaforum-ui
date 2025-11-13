// src/api/customerService.js - GÜNCEL VE HATASIZ

import http from "./http";
// Hata veren fonksiyon adı düzeltildi
import { getAdminAuthData } from "../utils/storage"; 

const BASE_URL = "/api/customers";

// Admin yetkilendirme başlıklarını ekleyen yardımcı fonksiyon
const getAuthHeaders = () => {
  const { username, password } = getAdminAuthData();
  if (!username || !password) {
    // Admin oturumu yoksa boş objeyi döndür (Bu durum ProtectedRoute'ta zaten engellenir)
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
  // Admin için CRUD işlemi olduğu için headers zorunludur
  return http.get(`${BASE_URL}/getAllCustomers`, { headers });
};

// --- CREATE (Admin: Yeni müşteri oluştur) ---
export const createCustomer = async (customerData) => {
  const headers = getAuthHeaders();
  // Admin yetkilendirme bilgilerini Request Body'ye SecureDTO olarak eklediğinizi varsayıyorum
  // Eğer RequestBody kullanıyorsanız, burayı sizin yapınıza göre düzenlemeniz gerekebilir.
  
  // Örnek: Eğer backendiniz SecureCustomerRequestDTO kullanıyorsa
  const { username, password } = getAdminAuthData();
  const securedRequest = {
      username: username,
      password: password,
      customer: customerData // Formdan gelen müşteri verisi
  };
  
  return http.post(`${BASE_URL}/createCustomer`, securedRequest, { headers: headers });
};


// --- UPDATE (Admin: Müşteriyi Güncelle) ---
export const updateCustomer = async (id, updatedCustomerData) => {
  const headers = getAuthHeaders();
  // PUT metodu için de Admin yetkilendirme başlıkları zorunludur
  return http.put(`${BASE_URL}/updateCustomer/${id}`, updatedCustomerData, { headers });
};

// --- DELETE (Admin: Müşteriyi Sil) ---
export const deleteCustomer = async (id) => {
  const headers = getAuthHeaders();
  // DELETE metodu için de Admin yetkilendirme başlıkları zorunludur
  return http.delete(`${BASE_URL}/deleteCustomer/${id}`, { headers });
};