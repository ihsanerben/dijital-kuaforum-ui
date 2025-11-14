// src/pages/UserAuthPage.jsx - +90 DÜZELTMESİ VE SON HALİ

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Tabs, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import PublicLayout from "../components/PublicLayout";
import {
  loginCustomer,
  registerOrUpdateCustomer,
} from "../api/customerAuthService";
import { isCustomerLoggedIn } from "../utils/storage";

const { Title } = Typography;

const UserAuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Yönlendirme mantığı useEffect içine taşındı
  useEffect(() => {
    if (isCustomerLoggedIn()) {
      navigate("/appointment", { replace: true });
    }
  }, [navigate]);

  // Eğer kullanıcı zaten giriş yapmışsa boş döner
  if (isCustomerLoggedIn()) {
    return null;
  }

  // Giriş Formu Gönderimi
  // src/pages/UserAuthPage.jsx (onLoginFinish)

    // Giriş Formu Gönderimi
    const onLoginFinish = async (values) => {
        setLoading(true);
        const fullPhoneNumber = "+90" + values.phoneNumber; 

        try {
            await loginCustomer(fullPhoneNumber, values.password);
            message.success('Giriş başarılı! Randevu sayfasına yönlendiriliyorsunuz.');
            navigate('/appointment', { replace: true }); 
        } catch (error) {
            // Backend'den gelen standart mesajı çekiyoruz (DTO'daki 'message')
            const backendMessage = error.response?.data?.message;
            let userMessage;

            if (backendMessage && backendMessage.includes("Kullanıcı bulunamadı")) {
                // Kullanıcı yoksa, register sekmesine yönlendiriyoruz
                userMessage = "Sistemde bu numara kayıtlı DEĞİLDİR. Lütfen 'Üye Ol' sekmesine geçin.";
            } else if (backendMessage && backendMessage.includes("Hatalı şifre")) {
                // Şifre yanlışsa, şifremi unuttum linkini hatırlatıyoruz
                userMessage = "Hatalı şifre girdiniz. Şifrenizi unuttuysanız 'Şifremi unuttum?' linkini kullanın.";
            } else {
                // Genel veya beklenmeyen hata
                userMessage = backendMessage || 'Giriş işlemi sırasında beklenmeyen bir hata oluştu.';
            }
            
            message.error(userMessage);

        } finally {
            setLoading(false);
        }
    };

  // Kayıt/Güncelleme Formu Gönderimi
  const onRegisterFinish = async (values) => {
    setLoading(true);
    // +90 ön ekini ekle
    const fullPhoneNumber = "+90" + values.phoneNumber;

    const dataToSend = {
      ...values,
      phoneNumber: fullPhoneNumber,
    };

    try {
      await registerOrUpdateCustomer(dataToSend);

      message.success(
        "İşlem başarılı! Giriş yapıldı ve randevu sayfasına yönlendiriliyorsunuz."
      );
      navigate("/appointment", { replace: true });
    } catch (error) {
      const msg = error.response?.data || "Kayıt işlemi başarısız oldu.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <Form name="customer_login" onFinish={onLoginFinish} layout="vertical">
      <Form.Item
        name="phoneNumber"
        label="Telefon Numarası (0 olmadan 10 hane)"
        rules={[
          { required: true, message: "Lütfen telefon numaranızı girin!" },
          { len: 10, message: "Telefon numarası 10 hane olmalıdır." },
        ]}
      >
        <Input
          addonBefore="+90"
          prefix={<PhoneOutlined />}
          placeholder="5321234567"
          maxLength={10}
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="Şifre"
        rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Şifre" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Giriş Yap
        </Button>
      </Form.Item>
      <div style={{ textAlign: "center" }}>
        <a
          onClick={() =>
            message.info("Bu özellik için e-posta entegrasyonu gereklidir.")
          }
        >
          Şifremi unuttum?
        </a>
      </div>
    </Form>
  );

  const registerForm = (
    <Form
      name="customer_register"
      onFinish={onRegisterFinish}
      layout="vertical"
    >
      <Form.Item
        name="fullName"
        label="Ad Soyad"
        rules={[
          { required: true, message: "Lütfen adınızı ve soyadınızı girin!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Ad Soyad" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Telefon Numarası (0 olmadan 10 hane)"
        rules={[
          { required: true, message: "Lütfen telefon numaranızı girin!" },
          { len: 10, message: "Telefon numarası 10 hane olmalıdır." },
        ]}
        extra="Telefon numaranız sistemde önceden kayıtlıysa, hesabınız güncellenecektir."
      >
        <Input
          addonBefore="+90"
          prefix={<PhoneOutlined />}
          placeholder="5321234567"
          maxLength={10}
        />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-posta Adresi"
        rules={[
          {
            type: "email",
            required: true,
            message: "Lütfen geçerli bir e-posta girin!",
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="E-posta" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Şifre Belirle"
        rules={[{ required: true, message: "Lütfen şifrenizi belirleyin!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Şifre" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Kayıt Ol / Hesabımı Güncelle
        </Button>
      </Form.Item>
    </Form>
  );

  const items = [
    { key: "login", label: "Giriş Yap", children: loginForm },
    {
      key: "register",
      label: "Üye Ol / Şifre Belirle",
      children: registerForm,
    },
  ];

  return (
    <PublicLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 180px)",
        }}
      >
        <Card
          title={
            <Title level={3} style={{ marginBottom: 0 }}>
              Müşteri Girişi ve Kaydı
            </Title>
          }
          style={{ width: 450 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            centered
          />
        </Card>
      </div>
    </PublicLayout>
  );
};

export default UserAuthPage;
