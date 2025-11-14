import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor'ın Hata Kısmını Kontrol Edin
http.interceptors.response.use(
    (response) => {
        // Başarılı yanıt
        return response;
    },
    (error) => {
        // Hata yanıtı (4xx veya 5xx)
        if (error.response && error.response.status === 401) {
            // Eğer 401 ise, Admin veya Müşteri oturumunu temizle
            // Bu kısım, hangi oturumun aktif olduğunu bilmediği için risklidir.
            // Amaç: Hatayı doğru formatta iletmek.
        }
        
        // Hata objesini, Frontend'deki catch bloğunun alması için olduğu gibi Promise'ten reddediyoruz.
        // Bu, Frontend'in error.response.data'ya erişmesini sağlar.
        return Promise.reject(error); // Hata objesini olduğu gibi geri döndür
    }
);

export default http;
