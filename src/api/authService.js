// src/api/authService.js - GÜNCEL VE HATASIZ

import http from "./http";
// YENİ VE DOĞRU ADMIN FONKSİYONLARI IMPORT EDİLDİ
import { saveAdminAuthData, clearAdminAuthData } from "../utils/storage"; 

const AUTH_LOGIN_ENDPOINT = "/auth";

export const login = async (username, password) => {
  try {
    const requestBody = {
      username: username,
      password: password,
    };

    const response = await http.post(
      `${AUTH_LOGIN_ENDPOINT}/login`,
      requestBody
    );

    const barberId = response.data.id;
    const barberName = response.data.username;
    const barberMessage = response.data.message;
    const barberStatus = response.request.status;
    console.log(
      `Login Response: ID=${barberId}, Username=${barberName}, Message=${barberMessage}, Status=${barberStatus}`
    );

    // Yeni admin fonksiyonu çağrıldı
    saveAdminAuthData(username, password);

    return response;
  } catch (error) {
    console.log(error.response.data);
  }
};

export const logout = () => {
  // Yeni admin fonksiyonu çağrıldı
  clearAdminAuthData();
};