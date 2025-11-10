import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/storage';

// Bu bileşen, içine aldığı bileşeni (children) korur.
const ProtectedRoute = ({ children }) => {
  // isLoggedIn fonksiyonu, storage.js'ten geliyor ve giriş yapılıp yapılmadığını kontrol ediyor.
  if (!isLoggedIn()) {
    // Eğer giriş yapılmamışsa, kullanıcıyı /login sayfasına yönlendir.
    return <Navigate to="/login" replace />;
  }

  // Eğer giriş yapılmışsa, istenen sayfayı (children) göster.
  return children;
};

export default ProtectedRoute;