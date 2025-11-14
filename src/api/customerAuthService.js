// src/api/customerAuthService.js - HATALARI YAKALAYAN GÜNCEL KOD

import http from './http';
import { saveCustomerAuthData, clearCustomerAuthData } from '../utils/storage'; 

const AUTH_BASE_URL = "/public/customerAuth"; 

export const registerOrUpdateCustomer = async (data) => {
    try {
        // Kayıt/Güncelleme isteği
        const response = await http.post(`${AUTH_BASE_URL}/register`, data);
        
        // Başarılı olursa, müşteri verilerini sakla
        if (response.data) {
            saveCustomerAuthData(response.data); 
        }
        return response.data;
    } catch (error) {
        console.log("USER ICIN", error.response.data);
        throw error;
    }
};

export const loginCustomer = async (phoneNumber, password) => {
    try {
        // Giriş isteği
        const response = await http.post(`${AUTH_BASE_URL}/login`, { phoneNumber, password });
        
        // Başarılı olursa, müşteri verilerini sakla
        if (response.data) {
            saveCustomerAuthData(response.data);
        }
        return response.data;
    } catch (error) {
        // Hata yakalandıysa, hatayı yeniden fırlat
        throw error; 
    }
};

export const logoutCustomer = () => {
    clearCustomerAuthData();
};