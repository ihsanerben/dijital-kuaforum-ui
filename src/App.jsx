// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Sayfa Importları
import LoginPage from "./pages/LoginPage";
import CustomerCRUDPage from "./pages/CustomerCRUDPage";
import ProtectedRoute from "./components/ProtectedRoute";

// YENİ/GÜNCELLENMİŞ SAYFA IMPORTLARI
import HomePage from './pages/HomePage';       // YENİ ANASAYFA
import AboutPage from './pages/AboutPage';
import PriceListPage from './pages/PriceListPage';
import ServicesPage from './pages/ServicesPage';
import StatisticsPage from './pages/StatisticsPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- Public (Açık) Rotalar --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/prices" element={<PriceListPage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* --- Korumalı Rotalar (Giriş Yapılması Gerekir) --- */}
        
        {/* Müşteri Yönetim Sayfası */}
        <Route path="/customers" element={
          <ProtectedRoute>
            <CustomerCRUDPage />
          </ProtectedRoute>
        } />
        
        {/* Raporlar ve İstatistik */}
        <Route path="/statistics" element={
          <ProtectedRoute>
            <StatisticsPage />
          </ProtectedRoute>
        } />
        
        {/* Giriş yapıldıktan sonra varsayılan olarak /customers'a yönlendir */}
        {/* Artık '/' anasayfa olduğu için bu satırı değiştirebiliriz
        <Route path="/" element={<Navigate to="/customers" replace />} /> */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;