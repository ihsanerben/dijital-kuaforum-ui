// src/App.jsx - SABİT SİDEBAR İÇİN YAPI

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Tüm importlar
import AdminLoginPage from "./pages/AdminLoginPage"; 
import UserAuthPage from "./pages/UserAuthPage"; 
import CustomerCRUDPage from "./pages/CustomerCRUDPage";
import AdminCalendarPage from './pages/AdminCalendarPage';
import StatisticsPage from './pages/StatisticsPage'; // İstatistik sayfası
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from './components/DashboardLayout'; // Layout
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PriceListPage from './pages/PriceListPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AppointmentPage from './pages/AppointmentPage';
import PublicCalendarPage from './pages/PublicCalendarPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- Public Rotalar (Aynı Kalır) --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/userAuth" element={<UserAuthPage />} /> 
        <Route path="/calendar" element={<PublicCalendarPage />} /> 
        <Route path="/appointment" element={<AppointmentPage />} /> 
        <Route path="/adminGiris" element={<AdminLoginPage />} /> 
        <Route path="/about" element={<AboutPage />} />
        <Route path="/prices" element={<PriceListPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />


      {/* --- KORUMALI ROTALAR GRUBU --- */}
        
        {/* 1. Korumayı (Auth Check) Sağla */}
        <Route element={<ProtectedRoute />}>
          
          {/* 2. Layout'u Sabitle (Sabit Sidebar) */}
          <Route element={<DashboardLayout />}> 
            
            {/* 3. Alt Sayfaları Yükle (İçerik) */}
            
            <Route path="/admin" element={<Navigate to="/adminCalendar" replace />} />
            <Route path="/adminCalendar" element={<AdminCalendarPage />} />
            <Route path="/customers" element={<CustomerCRUDPage />} />
            <Route path="/statistics" element={<StatisticsPage />} /> 

          </Route>
        </Route>

        {/* ... (Diğer Rotalar) ... */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;