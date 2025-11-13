// src/pages/UserAuthPage.jsx - HATA GİDERİLMİŞ KOD

import React, { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Tabs, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import PublicLayout from '../components/PublicLayout';
import { loginCustomer, registerOrUpdateCustomer } from '../api/customerAuthService'; 
// HATA BURADAYDI: isLoggedIn yerine doğru fonksiyonu import ediyoruz
import { isCustomerLoggedIn } from '../utils/storage';

const { Title } = Typography;

const UserAuthPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login'); 

    useEffect(() => {
        // isLoggedIn yerine isCustomerLoggedIn kullanıldı
        if (isCustomerLoggedIn()) { 
            navigate('/appointment', { replace: true }); 
        }
    }, [navigate]); 

    // Eğer kullanıcı zaten giriş yapmışsa (yönlendirme gerçekleşmeden hemen önce) boş döner
    // isLoggedIn yerine isCustomerLoggedIn kullanıldı
    if (isCustomerLoggedIn()) { 
        return null; 
    }

    // Giriş Formu Gönderimi
    const onLoginFinish = async (values) => {
        setLoading(true);
        try {
            await loginCustomer(values.phoneNumber, values.password);
            message.success('Giriş başarılı! Randevu sayfasına yönlendiriliyorsunuz.');
            // Başarılı girişten sonra randevu sayfasına yönlendir
            navigate('/appointment', { replace: true }); 
        } catch (error) {
            const msg = error.response?.data || 'Giriş işlemi başarısız oldu.';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Kayıt/Güncelleme Formu Gönderimi
    const onRegisterFinish = async (values) => {
        setLoading(true);
        try {
            const response = await registerOrUpdateCustomer(values);
            
            if (response && response.id) {
                // Backend'den mesaj gelse bile yönlendirme yapıyoruz
                message.success('İşlem başarılı! Giriş yapıldı ve randevu sayfasına yönlendiriliyorsunuz.');
                
                // Başarılı işlem sonrası randevu sayfasına yönlendir
                navigate('/appointment', { replace: true }); 
            }
        } catch (error) {
            const msg = error.response?.data || 'Kayıt işlemi başarısız oldu.';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };
    
    // ... (Formların yapısı aynı kalır)

    const loginForm = (
        <Form name="customer_login" onFinish={onLoginFinish} layout="vertical">
            <Form.Item
                name="phoneNumber"
                label="Telefon Numarası"
                rules={[{ required: true, message: 'Lütfen telefon numaranızı girin!' }]}
            >
                <Input prefix={<PhoneOutlined />} placeholder="Örn: 5551234567" />
            </Form.Item>
            <Form.Item
                name="password"
                label="Şifre"
                rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Şifre" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Giriş Yap
                </Button>
            </Form.Item>
             <div style={{ textAlign: 'center' }}>
                <a onClick={() => message.info('Bu özellik için e-posta entegrasyonu gereklidir.')}>Şifremi unuttum?</a>
            </div>
        </Form>
    );

    const registerForm = (
        <Form name="customer_register" onFinish={onRegisterFinish} layout="vertical">
            <Form.Item
                name="fullName"
                label="Ad Soyad"
                rules={[{ required: true, message: 'Lütfen adınızı ve soyadınızı girin!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Ad Soyad" />
            </Form.Item>
             <Form.Item
                name="phoneNumber"
                label="Telefon Numarası"
                rules={[{ required: true, message: 'Lütfen telefon numaranızı girin!' }]}
                extra="Telefon numaranız sistemde önceden kayıtlıysa, hesabınız güncellenecektir."
            >
                <Input prefix={<PhoneOutlined />} placeholder="Örn: 5551234567" />
            </Form.Item>
            <Form.Item
                name="email"
                label="E-posta Adresi (Zorunlu Değil)"
                rules={[{ type: 'email', message: 'Lütfen geçerli bir e-posta girin!' }]}
            >
                <Input prefix={<MailOutlined />} placeholder="E-posta" />
            </Form.Item>
            <Form.Item
                name="password"
                label="Şifre Belirle"
                rules={[{ required: true, message: 'Lütfen şifrenizi belirleyin!' }]}
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
        { key: 'login', label: 'Giriş Yap', children: loginForm },
        { key: 'register', label: 'Üye Ol / Şifre Belirle', children: registerForm },
    ];

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
                    title={<Title level={3} style={{ marginBottom: 0 }}>Müşteri Girişi ve Kaydı</Title>} 
                    style={{ width: 450 }}
                >
                    <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} centered />
                </Card>
            </div>
        </PublicLayout>
    );
};

export default UserAuthPage;