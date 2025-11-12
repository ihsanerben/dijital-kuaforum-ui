const AUTH_USERNAME_KEY = "auth_username";
const AUTH_PASSWORD_KEY = "auth_password";

export const saveAuthData = (username, password) => {
  localStorage.setItem(AUTH_USERNAME_KEY, username);
  localStorage.setItem(AUTH_PASSWORD_KEY, password);
};

export const getAuthData = () => {
  const username = localStorage.getItem(AUTH_USERNAME_KEY);
  const password = localStorage.getItem(AUTH_PASSWORD_KEY);
  return { username, password };
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_USERNAME_KEY);
  localStorage.removeItem(AUTH_PASSWORD_KEY);
};

export const isLoggedIn = () => {
  const { username, password } = getAuthData();
  return !!username && !!password;
};
