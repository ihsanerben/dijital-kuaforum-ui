import http from "./http";
import { saveAuthData, clearAuthData } from "../utils/storage";

const AUTH_LOGIN_ENDPOINT = "/auth/login";

export const login = async (username, password) => {
  try {
    // Backend'deki LoginRequestDTO'ya eşleşecek formatta JSON Body oluşturulur
    const requestBody = {
      username: username,
      password: password,
    };

    // POST isteği body ile birlikte gönderilir.
    const response = await http.post(AUTH_LOGIN_ENDPOINT, requestBody);

    // Login başarılıysa, diğer Customer CRUD işlemleri için kimlik bilgisi kaydedilir.
    saveAuthData(username, password);

    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  clearAuthData();
  // Yönlendirme işlemi, bileşen içinde yapılacaktır.
};
