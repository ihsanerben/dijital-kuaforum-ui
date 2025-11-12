import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// http.js (Örnek doğru yapı)
// http.js - response interceptor (error)
http.interceptors.response.use(
    (response) => { // Başarılı yanıt
        return response;
    },
    (error) => { // Hata yanıtı
        if (error.response && error.response.status === 401) {
            // Eğer 401 ise, oturum sonlandırma mantığını buraya ekleyin
            // Örneğin: storage.
            // Ancak şimdilik sadece hatayı fırlatıyoruz.
            
        }

        // Hata durumunda Promise'ı reddet ve hata nesnesini bir sonraki catch bloğuna ilet
        return Promise.reject(error); 
    }
);

export default http;
