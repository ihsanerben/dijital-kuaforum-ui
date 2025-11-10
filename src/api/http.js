import axios from 'axios';
// Artık getAuthData ve clearAuthData kullanılmıyor, silinebilir.

// Backend Adresinizi Buraya Yazın
const API_BASE_URL = 'http://localhost:8080/api'; 

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// !!! DİKKAT: Artık Basic Auth Interceptor'ı Yok. !!!
// Yetkilendirme (Username/Password) bilgisi her isteğe manuel olarak eklenecek.

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 401 hatası gelirse, Router kurulduktan sonra buraya yönlendirme eklenecek.
            console.error("Yetkisiz İstek (401). Oturum sonlandırıldı.");
            // Eğer isterseniz, burada yönlendirme yapılabilir: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default http;