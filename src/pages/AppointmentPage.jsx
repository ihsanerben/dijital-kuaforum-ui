// src/pages/AppointmentPage.jsx - GÜNCEL KOD (OTURUM KONTROLÜ EKLENDİ)

import React, { useState, useEffect } from 'react';
import { Typography, Card, Form, Checkbox, Button, message, Spin, Alert } from 'antd'; // Alert eklendi
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import PublicLayout from '../components/PublicLayout';
import { getAllHizmetler } from '../api/hizmetService'; 
import { createAppointment } from '../api/appointmentService';
import { isCustomerLoggedIn } from '../utils/storage'; // Oturum kontrolü için import edildi

const { Title, Text } = Typography;

const AppointmentPage = () => {
    const [hizmetler, setHizmetler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Oturum Kontrolü
    const loggedIn = isCustomerLoggedIn();

    // URL'den başlangıç zamanını al
    const queryParams = new URLSearchParams(location.search);
    const startTimeIso = queryParams.get('date');

    useEffect(() => {
        // 1. Randevu saati yoksa yönlendir
        if (!startTimeIso) {
            message.error('Randevu saati seçilmedi. Lütfen takvimden bir saat seçin.');
            navigate('/calendar', { replace: true });
            return;
        }

        // 2. Sadece giriş yapılmışsa hizmetleri çek
        if (loggedIn) {
            const fetchHizmetler = async () => {
                try {
                    const response = await getAllHizmetler();
                    const formattedHizmetler = response.data.map(h => ({
                        label: `${h.ad} (${h.sureDakika} dk - ${h.fiyat} TL)`,
                        value: h.id,
                        duration: h.sureDakika,
                    }));
                    setHizmetler(formattedHizmetler);
                } catch (error) {
                    message.error('Hizmet listesi yüklenemedi.');
                    console.error("Hizmet Çekme Hatası:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHizmetler();
        } else {
             // Eğer giriş yapılmadıysa, loading'i kapat
             setLoading(false);
        }
    }, [startTimeIso, navigate, loggedIn]);

    // Randevu Gönderme İşlemi
    const onFinish = async (values) => {
        if (!values.hizmetIdleri || values.hizmetIdleri.length === 0) {
            message.warning('Lütfen en az bir hizmet seçiniz.');
            return;
        }

        if (!loggedIn) {
            message.error('Randevu oluşturmak için lütfen giriş yapın veya üye olun.');
            navigate('/userAuth');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await createAppointment(startTimeIso, values.hizmetIdleri);
            
            const selectedHizmetDetails = hizmetler.filter(h => values.hizmetIdleri.includes(h.value));
            const totalDuration = selectedHizmetDetails.reduce((sum, h) => sum + h.duration, 0);

            // YENİ VE DETAYLI MÜŞTERİ BİLGİLENDİRME MESAJI
            message.success({
                content: (
                    <div>
                        <Text strong>Randevu talebiniz başarıyla alındı!</Text>
                        <p style={{ margin: 0, marginTop: 5 }}>
                           Başlangıç: {moment(startTimeIso).format('HH:mm')}, Süre: {totalDuration} dk.
                        </p>
                        <Text type="secondary">Kuaför onayı bekleniyor. Onaylandığında bilgi alacaksınız.</Text>
                    </div>
                ),
                duration: 5, // Mesajı daha uzun süre göster
            });
            
            navigate('/', { replace: true });

        } catch (error) {
            // Çakışma hatalarında özel mesaj göster
            if (error.response && error.response.status === 409) {
                message.error('Üzgünüz, seçtiğiniz saat dilimi saniyeler içinde başkası tarafından alındı veya çakışma oluştu.');
            } else {
                 const msg = error.response?.data || 'Randevu oluşturulurken bir hata oluştu.';
                message.error(msg);
            }
            console.error("Randevu Hata:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!startTimeIso) {
        return (
            <PublicLayout>
                <Spin tip="Yönlendiriliyor..." />
            </PublicLayout>
        );
    }
    
    // Toplam süreyi hesapla (sadece göstermek için)
    const selectedHizmetIdleri = form.getFieldValue('hizmetIdleri') || [];
    const selectedHizmetDetails = hizmetler.filter(h => selectedHizmetIdleri.includes(h.value));
    const totalDuration = selectedHizmetDetails.reduce((sum, h) => sum + h.duration, 0);
    const endTime = moment(startTimeIso).add(totalDuration, 'minutes').format('HH:mm');
    
    // Formun içeriği: Giriş yapılıp yapılmamasına göre değişir
    const FormContent = () => {
        if (!loggedIn) {
            return (
                <Alert
                    message="Giriş Yapınız"
                    description="Randevu talebi oluşturabilmek için öncelikle sisteme giriş yapmanız veya üye olmanız gerekmektedir."
                    type="warning"
                    showIcon
                    action={
                        <Button size="small" type="primary" onClick={() => navigate('/userAuth')}>
                            Giriş Yap / Üye Ol
                        </Button>
                    }
                />
            );
        }
        
        // Eğer giriş yapıldıysa formu göster
        return (
            <Spin spinning={loading || isSubmitting}>
                <Form
                    form={form}
                    name="appointment_form"
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{ hizmetIdleri: [] }}
                    onValuesChange={() => form.validateFields(['hizmetIdleri'])}
                >
                    <Form.Item
                        name="hizmetIdleri"
                        label={<Title level={5}>Almak İstediğiniz Hizmetler</Title>}
                        rules={[{ required: true, message: 'Lütfen en az bir hizmet seçiniz.' }]}
                    >
                        <Checkbox.Group options={hizmetler} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={isSubmitting}>
                            Randevu Talebini Gönder ({totalDuration > 0 ? totalDuration + ' dk' : ''})
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        );
    };


    return (
        <PublicLayout>
            <Title level={2}>Randevu Oluşturma</Title>

            <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                <Text strong style={{ fontSize: '18px' }}>Seçilen Başlangıç Saati:</Text>
                <Title level={4} style={{ color: '#695acb', marginTop: 0 }}>
                    {moment(startTimeIso).format('DD MMMM YYYY - HH:mm')}
                </Title>
                
                {totalDuration > 0 && (
                    <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
                        Tahmini Bitiş: {endTime} (Toplam Süre: {totalDuration} dakika)
                    </Text>
                )}

                <FormContent /> 
            </Card>
        </PublicLayout>
    );
};

export default AppointmentPage;