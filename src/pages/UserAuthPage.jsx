// src/pages/UserAuthPage.jsx
import React, { useState } from "react";
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

const { Title } = Typography;

const UserAuthPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // --- Giriş İşlemi ---
  const onLoginFinish = async (values) => {
    setLoading(true);
    const fullPhoneNumber = "+90" + values.phoneNumber;

    try {
      await loginCustomer(fullPhoneNumber, values.password);
      messageApi.success(
        "Giriş başarılı! Randevu sayfasına yönlendiriliyorsunuz."
      );
      setTimeout(() => {
        navigate("/appointment", { replace: true });
      }, 1500); 
    } catch (error) {
      const backendMessage = error.response?.data?.messageApi;
      let userMessage;

      if (backendMessage && backendMessage.includes("Kullanıcı bulunamadı")) {
        userMessage =
          "Bu numaraya kayıtlı bir kullanıcı YOKTUR. Lütfen 'Üye Ol' sekmesine geçin.";
      } else if (backendMessage && backendMessage.includes("Hatalı şifre")) {
        userMessage =
          "Bu numaraya kayıtlı bir kullanıcı vardır ancak girdiğiniz şifre hatalıdır. Lütfen kontrol ediniz.";
      } else {
        userMessage =
          backendMessage ||
          "Giriş işlemi sırasında beklenmeyen bir hata oluştu.";
      }

      console.error("LOGIN HATA:", error.response?.data);
      messageApi.error(userMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Kayıt / Güncelleme İşlemi ---
  const onRegisterFinish = async (values) => {
    setLoading(true);
    const fullPhoneNumber = "+90" + values.phoneNumber;
    const dataToSend = { ...values, phoneNumber: fullPhoneNumber };

    try {
      await registerOrUpdateCustomer(dataToSend);
      messageApi.success(
        "İşlem başarılı! Giriş yapıldı ve randevu sayfasına yönlendiriliyorsunuz."
      );
      setTimeout(() => {
        navigate("/appointment", { replace: true });
      }, 1500); 
    } catch (error) {
      const backendMessage =
        error.response?.data || "Kayıt işlemi başarısız oldu.";
      console.error("REGISTER HATA:", error.response?.data);
      messageApi.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Formlar ---
  const loginForm = (
    <Form name="customer_login" onFinish={onLoginFinish} layout="vertical">
      <Form.Item
        name="phoneNumber"
        label="Telefon Numarası (0 olmadan 10 hane)"
        rules={[
          { required: true, messageApi: "Lütfen telefon numaranızı girin!" },
          { len: 10, messageApi: "Telefon numarası 10 hane olmalıdır." },
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
        rules={[{ required: true, messageApi: "Lütfen şifrenizi girin!" }]}
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
            messageApi.info("Bu özellik için e-posta entegrasyonu gereklidir.")
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
          { required: true, messageApi: "Lütfen adınızı ve soyadınızı girin!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Ad Soyad" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Telefon Numarası (0 olmadan 10 hane)"
        rules={[
          { required: true, messageApi: "Lütfen telefon numaranızı girin!" },
          { len: 10, messageApi: "Telefon numarası 10 hane olmalıdır." },
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
            messageApi: "Lütfen geçerli bir e-posta girin!",
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="E-posta" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Şifre Belirle"
        rules={[{ required: true, messageApi: "Lütfen şifrenizi belirleyin!" }]}
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
    <>
      {contextHolder}
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
    </>
  );
};

export default UserAuthPage;
