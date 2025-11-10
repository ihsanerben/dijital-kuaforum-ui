// LocalStorage anahtarları
const AUTH_USERNAME_KEY = 'auth_username';
const AUTH_PASSWORD_KEY = 'auth_password';

// Kullanıcı adı ve şifreyi kaydeder
export const saveAuthData = (username, password) => {
  localStorage.setItem(AUTH_USERNAME_KEY, username);
  localStorage.setItem(AUTH_PASSWORD_KEY, password);
};

// Kaydedilmiş kimlik bilgilerini alır
export const getAuthData = () => {
  const username = localStorage.getItem(AUTH_USERNAME_KEY);
  const password = localStorage.getItem(AUTH_PASSWORD_KEY);
  return { username, password };
};

// Çıkış (Logout) işlemi için bilgileri siler
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_USERNAME_KEY);
  localStorage.removeItem(AUTH_PASSWORD_KEY);
};

// Giriş yapılıp yapılmadığını kontrol eder
export const isLoggedIn = () => {
  const { username, password } = getAuthData();
  return !!username && !!password; 
};