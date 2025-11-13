// src/api/hizmetService.js (YENİ DOSYA)

import http from './http';

const BASE_URL = "/hizmetler";

// Tüm hizmetleri çeker (Müşteri için public endpoint)
export const getAllHizmetler = async () => {
    // GET /api/hizmetler/public/getAll
    return http.get(`${BASE_URL}/public/getAll`);
};