// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    Form, Input, Button, Card, Typography, message, 
    // Layout ve Content silindi
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../api/authService";
// PublicLayout import edildi
import PublicLayout from '../components/PublicLayout'; 


const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    let errorMessage = "";

    try {
      await login(values.username, values.password);
      
      message.success("Giriş başarılı! Müşteri sayfasına yönlendiriliyorsunuz...");
      
      navigate("/customers");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        errorMessage = "Giriş sırasında bir hata oluştu: Kullanıcı adı veya şifre hatalı!";
      } else if (error.response) {
        // Sunucu kaynaklı diğer hatalar
        errorMessage = `Sunucu Hatası (${error.response.status})`;
      } else {
        // Ağ veya diğer hatalar
        errorMessage = `Hata: ${error.message}`;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // İçeriği PublicLayout ile sarıyoruz
    <PublicLayout>
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            // Layout'un iç Content alanını kaplaması için minimum yükseklik
            minHeight: 'calc(100vh - 180px)' 
          }}
        >
          <Card 
            title={<Title level={3} style={{ marginBottom: 0 }}>Kuaför Yönetici Girişi</Title>} 
            style={{ width: 400 }}
          >
            <Form
              name="login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Kullanıcı Adı" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Şifre"
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

export default LoginPage;