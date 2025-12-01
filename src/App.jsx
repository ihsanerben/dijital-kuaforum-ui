// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// importlar...
import AdminLoginPage from "./pages/AdminLoginPage";
import UserAuthPage from "./pages/UserAuthPage";
import CustomerCRUDPage from "./pages/CustomerCRUDPage";
import AdminCalendarPage from "./pages/AdminCalendarPage";
import StatisticsPage from "./pages/StatisticsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PriceListPage from "./pages/PriceListPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import AppointmentPage from "./pages/AppointmentPage";
import PublicCalendarPage from "./pages/PublicCalendarPage";
import HizmetCRUDPage from './pages/HizmetCRUDPage'; // YENİ IMPORT
import UrunCRUDPage from "./pages/UrunCRUDPage";
import CustomerStatsPage from "./pages/CustomerStatsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/userAuth" element={<UserAuthPage />} />
        <Route path="/calendar" element={<PublicCalendarPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
         <Route path="/ridvancengiz" element={<AdminLoginPage />} />
         <Route path="/adminGiris" element={<AdminLoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/prices" element={<PriceListPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/adminCalendar" replace />}
            />
            <Route path="/adminCalendar" element={<AdminCalendarPage />} />
            <Route path="/customers" element={<CustomerCRUDPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/customerStats/:id" element={<CustomerStatsPage />} />
            <Route path="/hizmetler" element={<HizmetCRUDPage />} />
            <Route path="/urunler" element={<UrunCRUDPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
