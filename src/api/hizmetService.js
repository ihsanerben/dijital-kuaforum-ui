// src/api/hizmetService.js - FİNAL VE EKSİKSİZ KOD

import http from './http';
// getAdminAuthData'yı import edin
import { getAdminAuthData } from '../utils/storage'; 

const BASE_URL = "/hizmetler";

// Admin Yetkilendirme Başlıklarını Hazırlar
const getAdminHeaders = () => {
    const { username, password } = getAdminAuthData();
    return { Username: username, Password: password };
};

// 1. Tüm hizmetleri çeker (Public)
export const getAllHizmetler = async () => {
    // GET /api/hizmetler/public/getAll
    return http.get(`${BASE_URL}/public/getAll`);
};

// 2. Yeni hizmet oluşturur (Admin)
export const createHizmet = async (data) => {
    const headers = getAdminHeaders();
    // POST /api/hizmetler/create
    return http.post(`${BASE_URL}/create`, data, { headers });
};

// 3. Hizmet günceller (Admin)
export const updateHizmet = async (id, data) => {
    const headers = getAdminHeaders();
    // PUT /api/hizmetler/update/{id}
    return http.put(`${BASE_URL}/update/${id}`, data, { headers });
};

// 4. Hizmet siler (Admin)
export const deleteHizmet = async (id) => {
    const headers = getAdminHeaders();
    // DELETE /api/hizmetler/delete/{id}
    return http.delete(`${BASE_URL}/delete/${id}`, { headers });
};

// Tüm hizmetleri Admin yetkisiyle çeken metot.
export const getAllHizmetlerAdmin = async () => {
    const headers = getAdminHeaders(); 
    return http.get(`${BASE_URL}/public/getAll`, { headers }); 
};