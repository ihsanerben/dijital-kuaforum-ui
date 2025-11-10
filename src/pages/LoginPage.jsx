import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../api/authService.js';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      
      message.success('Giriş başarılı! Müşteri sayfasına yönlendiriliyorsunuz...');
      // Yönlendirme
      navigate('/customers'); 

    } catch (error) {
      let errorMessage = 'Giriş sırasında bir hata oluştu.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'Kullanıcı adı veya şifre hatalı.';
      } else if (error.message) {
        errorMessage = `Hata: ${error.message}`;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Kuaför Backend Girişi</Title>
        </div>
        
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          {/* Kullanıcı Adı */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Lütfen kullanıcı adınızı giriniz!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Kullanıcı Adı" />
          </Form.Item>

          {/* Şifre */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Şifre"
            />
          </Form.Item>

          {/* Giriş Butonu */}
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;