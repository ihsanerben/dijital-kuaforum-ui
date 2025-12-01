// src/utils/storage.js - SON HALİ

// --- 1. ADMIN (Kuaför) İÇİN ANAHTARLAR ---
const AUTH_USERNAME_KEY = "auth_username";
const AUTH_PASSWORD_KEY = "auth_password";

// --- 2. MÜŞTERİ İÇİN ANAHTARLAR ---
const CUSTOMER_DATA_KEY = "customer_data"; // Müşteri nesnesini saklamak için

// --- ADMIN FONKSİYONLARI ---
export const saveAdminAuthData = (username, password) => { // ADI DEĞİŞTİ
  localStorage.setItem(AUTH_USERNAME_KEY, username);
  localStorage.setItem(AUTH_PASSWORD_KEY, password);
};

export const getAdminAuthData = () => { // ADI DEĞİŞTİ
  const username = localStorage.getItem(AUTH_USERNAME_KEY);
  const password = localStorage.getItem(AUTH_PASSWORD_KEY);
  return { username, password };
};

export const clearAdminAuthData = () => { // ADI DEĞİŞTİ
  localStorage.removeItem(AUTH_USERNAME_KEY);
  localStorage.removeItem(AUTH_PASSWORD_KEY);
};

export const isAdminLoggedIn = () => { // ADI DEĞİŞTİ
  const { username, password } = getAdminAuthData();
  return !!username && !!password;
};


// --- MÜŞTERİ FONKSİYONLARI (YENİ EKLENDİ) ---
export const saveCustomerAuthData = (customerData) => {
    localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customerData));
};

export const getCustomerAuthData = () => {
    const data = localStorage.getItem(CUSTOMER_DATA_KEY);
    return data ? JSON.parse(data) : null;
};

export const clearCustomerAuthData = () => {
    localStorage.removeItem(CUSTOMER_DATA_KEY);
};

export const isCustomerLoggedIn = () => {
    return localStorage.getItem(CUSTOMER_DATA_KEY) !== null;
};