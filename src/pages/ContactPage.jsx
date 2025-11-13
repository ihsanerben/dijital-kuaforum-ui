// src/pages/ContactPage.jsx - Harita Genişliği ve Konumu Düzeltildi

import React from 'react';
import { Typography, Row, Col, Card, Form, Input, Button, Space } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons'; 
import PublicLayout from '../components/PublicLayout';

const { Title, Paragraph } = Typography;

// Sizin bilgileriniz ve Harita URL'si
const CONTACT_INFO = {
    address: "Turing Otomobil Kurumu, Altınşehir Mahallesi Kral Sokak No: 1453 Daire: 7",
    email: "ihsanerben@gmail.com",
    phone: "0571 638 1453",
    // Düzeltilmiş Google Haritalar embed URL'si (Turing Otomobil Kurumu, İstanbul)
    // Bu URL'yi tam olarak çalışıp çalışmadığını kontrol ediniz. Çalışmazsa, kendi haritanızdan almanız gerekir.
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.261908779653!2d28.9730511802111!3d41.06649856525996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab65d625d9095%3A0x63311e6216e25f8!2sTuring%20Otomobil%20Kurumu!5e0!3m2!1str!2str!4v1700473216599!5m2!1str!2str"
};

const ContactPage = () => {
    
    const onFinish = (values) => {
        console.log('İletişim Formu Gönderildi:', values);
        alert('Mesajınız başarıyla iletildi!');
    };

    return (
        <PublicLayout>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
                Bizimle İletişime Geçin
            </Title>

            <Row gutter={[32, 32]}>
                
                {/* Sol Sütun: İletişim Formu */}
                <Col xs={24} lg={12}>
                    <Card title="Bize Mesaj Gönderin">
                        <Form
                            name="contact_form"
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="name"
                                label="Adınız Soyadınız"
                                rules={[{ required: true, message: 'Lütfen adınızı girin!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="E-posta Adresiniz"
                                rules={[{ required: true, message: 'Lütfen geçerli bir e-posta girin!' }]}
                            >
                                <Input type="email" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Mesajınız"
                                rules={[{ required: true, message: 'Lütfen mesajınızı girin!' }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Gönder
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Sağ Sütun: Bilgiler ve Harita */}
                <Col xs={24} lg={12}>
                    <Card title="İletişim Bilgileri" style={{ marginBottom: 20 }}> {/* Harita ile kart arasına boşluk */}
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Title level={5}><EnvironmentOutlined /> Adres</Title>
                                <Paragraph>{CONTACT_INFO.address}</Paragraph>
                            </div>
                            <div>
                                <Title level={5}><MailOutlined /> E-posta</Title>
                                <Paragraph>{CONTACT_INFO.email}</Paragraph>
                            </div>
                            <div>
                                <Title level={5}><PhoneOutlined /> Telefon</Title>
                                <Paragraph>{CONTACT_INFO.phone}</Paragraph>
                            </div>
                        </Space>
                    </Card>
                    
                    {/* Google Harita Eklentisi - Tam genişlik */}
                    <Title level={5} style={{ marginTop: 20 }}>Konumumuz</Title>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}> {/* Responsive iframe için sarmalayıcı div */}
                        <iframe
                            src={CONTACT_INFO.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ 
                                border: 0, 
                                position: 'absolute', 
                                top: 0, 
                                left: 0 
                            }} // Tam alanı kapla
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Kuaför Konumu"
                        ></iframe>
                    </div>
                </Col>
            </Row>
        </PublicLayout>
    );
};

export default ContactPage;