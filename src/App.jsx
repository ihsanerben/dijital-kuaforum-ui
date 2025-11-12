import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Mevcut sayfalarınız
import LoginPage from "./pages/LoginPage";
import CustomerCRUDPage from "./pages/CustomerCRUDPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Kuaför Giriş Sayfası (Herkese Açık) */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- Korumalı Rotalar (Giriş Yapılmasını Gerektirir) --- */}

        {/* Müşteri Yönetim Sayfası */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerCRUDPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
