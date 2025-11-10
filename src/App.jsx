import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Sayfalar ve Bileşenler
import LoginPage from './pages/LoginPage';
import CustomerCRUDPage from './pages/CustomerCRUDPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // BrowserRouter, uygulamada routing'i etkinleştirir
    <BrowserRouter>
      {/* Routes, tüm rotalarımızı tanımladığımız kapsayıcıdır */}
      <Routes>
        
        {/* Login Sayfası: Herkesin erişimine açık olmalı */}
        <Route path="/login" element={<LoginPage />} />

        {/* Müşteri Sayfası: ProtectedRoute ile korunuyor */}
        <Route 
          path="/customers" 
          element={
            <ProtectedRoute>
              {/* Giriş yapıldıysa bu bileşen gösterilir */}
              <CustomerCRUDPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Varsayılan Rota: Ana dizine (/) gelen isteği /login'e yönlendirir */}
        <Route path="/" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;