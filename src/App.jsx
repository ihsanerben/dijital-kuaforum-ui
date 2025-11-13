// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Sayfa Importları
// LoginPage yerine AdminLoginPage import edildi
import AdminLoginPage from "./pages/AdminLoginPage";
import UserAuthPage from "./pages/UserAuthPage"; // YENİ: Müşteri Giriş/Kayıt Sayfası
import CustomerCRUDPage from "./pages/CustomerCRUDPage";
import ProtectedRoute from "./components/ProtectedRoute";

// YENİ/GÜNCELLENMİŞ SAYFA IMPORTLARI
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PriceListPage from "./pages/PriceListPage";
import ServicesPage from "./pages/ServicesPage";
import StatisticsPage from "./pages/StatisticsPage";

import AppointmentPage from "./pages/AppointmentPage"; // YENİ
import PublicCalendarPage from "./pages/PublicCalendarPage"; // YENİ
import AdminCalendarPage from "./pages/AdminCalendarPage"; // YENİ

import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public (Açık) Rotalar --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/prices" element={<PriceListPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} /> {/* YENİ ROTA */}
        {/* YENİ: Müşteri Giriş/Kayıt Sayfası */}
        <Route path="/userAuth" element={<UserAuthPage />} />
        {/* YENİ: Kuaför Girişi (Gizli Rota) */}
        <Route path="/adminGiris" element={<AdminLoginPage />} />
        {/* Haftalık Takvim (Gereksinim 3) */}
        <Route path="/calendar" element={<PublicCalendarPage />} />
        {/* Randevu Oluşturma Rotası (Gereksinim 3/4) */}
        <Route path="/appointment" element={<AppointmentPage />} />
        {/* --- Korumalı Rotalar (Giriş Yapılması Gerekir) --- */}
        {/* Müşteri Yönetim Sayfası */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerCRUDPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminCalendar"
          element={
            <ProtectedRoute>
              <AdminCalendarPage />
            </ProtectedRoute>
          }
        />
        {/* Raporlar ve İstatistik */}
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />
        {/* Giriş yapıldıktan sonra varsayılan olarak /customers'a yönlendir */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
