// src/components/ProtectedRoute.jsx - SADECE KORUMA (LAYOUT KALDIRILDI)

import React from 'react';
// Outlet'i bu yapı için kullanmalıyız
import { Navigate, Outlet } from 'react-router-dom'; 
import { isAdminLoggedIn } from '../utils/storage'; 

const ProtectedRoute = () => {
    // Eğer Admin giriş yapmadıysa, giriş sayfasına yönlendir
    if (!isAdminLoggedIn()) { 
        return <Navigate to="/adminGiris" replace />;
    }
    
    // Giriş yapılmışsa, içindeki alt rotayı (Layout'u) render et
    return <Outlet />; 
};

export default ProtectedRoute;