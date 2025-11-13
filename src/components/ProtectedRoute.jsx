// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
// GÜNCELLEME: Admin oturumunu kontrol etmek için doğru fonksiyonu import edin
import { isAdminLoggedIn } from '../utils/storage'; 

const ProtectedRoute = ({ children }) => {
    // BURADAKİ FONKSİYON DA isAdminLoggedIn OLMALI
    if (!isAdminLoggedIn()) { 
        // Giriş yapılmamışsa Admin giriş sayfasına yönlendir
        return <Navigate to="/adminGiris" replace />;
    }
    return children;
};

export default ProtectedRoute;