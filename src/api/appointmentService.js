// src/api/appointmentService.js - FİNAL VE EKSİKSİZ KOD

import http from './http'; 
import { getCustomerAuthData, getAdminAuthData } from '../utils/storage'; 
import moment from 'moment';

const BASE_URL = "/randevular";

// Admin Yetkilendirme Başlıklarını Alır (Sadece Admin metotları için)
const getAdminHeaders = () => {
    // getAdminAuthData'nın import edildiğini varsayalım
    const { username, password } = getAdminAuthData();
    return { Username: username, Password: password };
};

// --- Randevu (Müşteri/Public) Metotları ---

// 1. Randevuları Takvim Görünümü İçin Çekme
export const getAppointmentsForCalendar = async (date) => {
    return http.get(`${BASE_URL}/takvim`, {
        params: { tarih: date },
    });
};

// 2. Yeni Randevu Oluşturma (Müşteri)
export const createAppointment = async (startTime, serviceIds) => {
    const customerData = getCustomerAuthData();
    
    if (!customerData || !customerData.id) {
        throw new Error("Randevu oluşturmak için müşteri oturumu açık olmalıdır."); 
    }
    
    const formattedStartTime = moment(startTime).format('YYYY-MM-DDTHH:mm:ss');

    const requestBody = {
        customerId: Number(customerData.id), 
        startTime: formattedStartTime, 
        hizmetIdleri: serviceIds
    };
    
    return http.post(`${BASE_URL}/olustur`, requestBody);
};

// YENİ METOT: Müşteri geçmiş randevularını Admin yetkisiyle çeker
export const getMusteriGecmisRandevulari = async (customerId) => {
    const headers = getAdminHeaders(); 
    return http.get(`${BASE_URL}/admin/musteriGecmis/${customerId}`, { headers });
};

// YENİ METOT: Admin için uygun saatleri çeker
export const getAvailableSlotsAdmin = async (serviceId, date) => {
    const headers = getAdminHeaders(); 
    return http.get(`${BASE_URL}/admin/availableSlots`, { 
        headers, 
        params: { serviceId, date } 
    });
};

// YENİ METOT: Admin tarafından randevu oluşturur
export const createAppointmentAdmin = async (appointmentData) => {
    const headers = getAdminHeaders(); 
    return http.post(`${BASE_URL}/admin/create`, appointmentData, { headers });
};


// --- İSTATİSTİK VE YÖNETİM METOTLARI ---

// 3. Tüm Randevuları Çekme (Admin Paneli İçin)
export const getAllAppointmentsAdmin = async () => {
    const headers = getAdminHeaders();
    return http.get(`${BASE_URL}/admin/hepsi`, { headers });
};

// 4. Randevu Durumunu Güncelleme (Onaylama/Reddetme)
export const updateAppointmentStatus = async (id, newStatus) => {
    const headers = getAdminHeaders();
    return http.put(`${BASE_URL}/admin/guncelle/${id}?yeniDurum=${newStatus}`, null, { headers });
};

// 5. KRİTİK EKSİK METOT: İstatistik verilerini çeker
export const getAdminStatistics = async () => {
    const headers = getAdminHeaders();
    return http.get(`${BASE_URL}/admin/istatistik`, { headers });
};