// src/api/customerAuthService.js - GÜNCELLENMİŞ

import http from './http';
// YENİ VE DOĞRU MÜŞTERİ FONKSİYONLARI IMPORT EDİLİYOR
import { saveCustomerAuthData, clearCustomerAuthData } from '../utils/storage'; 

const AUTH_BASE_URL = "/public/customerAuth"; // Rota düzenlendi (API prefix'i eklendi)

export const registerOrUpdateCustomer = async (data) => {
    // Kayıt/Güncelleme isteği
    const response = await http.post(`${AUTH_BASE_URL}/register`, data);
    
    // Başarılı olursa, müşteri verilerini AYRI ANAHTARDA sakla
    if (response.data) {
        saveCustomerAuthData(response.data); 
    }
    return response.data;
};

export const loginCustomer = async (phoneNumber, password) => {
    // Giriş isteği
    const response = await http.post(`${AUTH_BASE_URL}/login`, { phoneNumber, password });
    
    // Başarılı olursa, müşteri verilerini AYRI ANAHTARDA sakla
    if (response.data) {
        saveCustomerAuthData(response.data);
    }
    return response.data;
};

export const logoutCustomer = () => {
    // MÜŞTERİ VERİLERİNİ TEMİZLE
    clearCustomerAuthData();
};