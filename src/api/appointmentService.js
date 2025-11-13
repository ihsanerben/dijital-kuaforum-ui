// src/api/appointmentService.js (GÜNCEL HALİ)

import http from './http';
import { getCustomerAuthData, getAdminAuthData } from '../utils/storage'; 

const BASE_URL = "/randevular";

// Admin Yetkilendirme Başlıklarını Alır
const getAdminHeaders = () => {
    const { username, password } = getAdminAuthData();
    return { Username: username, Password: password };
};

// 1. Randevuları Takvim Görünümü İçin Çekme (Aynı Kalır)
export const getAppointmentsForCalendar = async (date) => {
    return http.get(`${BASE_URL}/takvim`, {
        params: { tarih: date },
    });
};

// 2. Yeni Randevu Oluşturma (Aynı Kalır)
export const createAppointment = async (startTime, serviceIds) => {
    // ... (Müşteri doğrulama ve POST isteği mantığı aynı kalır) ...
};

// --- YENİ ADMIN METOTLARI ---

// 3. Tüm Randevuları Çekme (Admin Paneli İçin)
export const getAllAppointmentsAdmin = async () => {
    const headers = getAdminHeaders();
    // GET /api/randevular/admin/hepsi
    return http.get(`${BASE_URL}/admin/hepsi`, { headers });
};

// 4. Randevu Durumunu Güncelleme (Onaylama/Reddetme)
export const updateAppointmentStatus = async (id, newStatus) => {
    const headers = getAdminHeaders();
    // PUT /api/randevular/admin/guncelle/{id}?yeniDurum=ONAYLANDI
    return http.put(`${BASE_URL}/admin/guncelle/${id}?yeniDurum=${newStatus}`, null, { headers });
};