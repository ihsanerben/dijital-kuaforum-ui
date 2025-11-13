// src/pages/AdminLoginPage.jsx - SON FİNAL DÜZELTME

import React, { useState, useEffect } from 'react'; // useEffect import edildi
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../api/authService"; 
import { isAdminLoggedIn } from '../utils/storage'; 
import PublicLayout from '../components/PublicLayout'; 


const { Title } = Typography;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // YÖNLENDİRME MANTIĞI useEffect İÇİNE TAŞINDI
  useEffect(() => {
    if (isAdminLoggedIn()) {
      // Admin zaten giriş yapmışsa direkt müşteriler sayfasına yönlendir
      navigate("/customers", { replace: true });
    }
  }, [navigate]);

  // YÖNLENDİRME GERÇEKLEŞMEDEN HEMEN ÖNCE BOŞ DÖN
  if (isAdminLoggedIn()) { 
    return null;
  }
  
  // YÖNETİCİ GİRİŞ İŞLEMİ
  const onFinish = async (values) => {
    setLoading(true);
    let errorMessage = "";

    try {
      await login(values.username, values.password);
      
      message.success("Yönetici girişi başarılı! Müşteri sayfasına yönlendiriliyorsunuz...");
      
      // Başarılı giriş sonrası yönlendirme
      navigate("/customers", { replace: true }); 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        errorMessage = "Giriş sırasında bir hata oluştu: Kullanıcı adı veya şifre hatalı!";
      } else if (error.response) {
        errorMessage = `Sunucu Hatası (${error.response.status})`;
      } else {
        errorMessage = `Hata: ${error.message}`;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: 'calc(100vh - 180px)' 
          }}
        >
          <Card 
            title={<Title level={3} style={{ marginBottom: 0 }}>Kuaför Yönetici Girişi</Title>} 
            style={{ width: 400 }}
          >
            <Form
              name="admin_login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Yönetici Kullanıcı Adı" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Yönetici Şifresi"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Giriş Yap
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
    </PublicLayout>
  );
};

export default AdminLoginPage;