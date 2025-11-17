// src/services/urunService.js

import axios from 'axios';
import { getAdminAuthData } from '../utils/storage'; // Auth bilgilerini alacağınız varsayılıyor

const API_URL = 'http://localhost:8080/api/urunler'; 

// --- YARDIMCI FONKSİYON: Admin Header'larını alır ---
// Not: getAdminAuthData fonksiyonu muhtemelen auth.js dosyanızda
// username ve password'ü localStorage'dan alarak bir headers objesi döndürüyordur.

// --- CRUD İŞLEMLERİ ---

export const getUrunler = async () => {
    try {
        const headers = getAdminAuthData();
        const response = await axios.get(`${API_URL}/getAll`, { headers });
        return response.data;
    } catch (error) {
        console.error(error.response.data);
        throw error;
    }
};

export const createUrun = async (urunData) => {
    try {
        const headers = getAdminAuthData();
        const response = await axios.post(`${API_URL}/create`, urunData, { headers });
        return response.data;
    } catch (error) {
        console.error(error.response.data);
        throw error;
    }
};

export const updateUrun = async (id, urunData) => {
    try {
        const headers = getAdminAuthData();
        const response = await axios.put(`${API_URL}/update/${id}`, urunData, { headers });
        return response.data;
    } catch (error) {
        console.error(error.response.data);
        throw error;
    }
};

export const deleteUrun = async (id) => {
    try {
        const headers = getAdminAuthData();
        const response = await axios.delete(`${API_URL}/delete/${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error(error.response.data);
        throw error;
    }
};

// Bu servis dosyasının AdminLayout'taki Admin Side Bar'da kullanılabilmesi için
// src/components/AdminSidebar.jsx dosyanıza bir menü ögesi eklemeyi unutmayın:
// { key: 'urunler', icon: <ShoppingOutlined />, label: 'Ürünler' }