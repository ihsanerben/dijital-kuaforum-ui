// src/pages/ContactPage.jsx - FINAL CODE

import React, { useState } from 'react';
import { Typography, Row, Col, Card, Form, Input, Button, Space, App } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons'; 
import PublicLayout from '../components/PublicLayout';
// Import the new service
import { sendContactMessage } from '../api/contactService'; 

const { Title, Paragraph } = Typography;

const CONTACT_INFO = {
    address: "Turing Otomobil Kurumu, Altınşehir Mahallesi Kral Sokak No: 1453 Daire: 7",
    email: "ihsanerben@gmail.com",
    phone: "0541 730 8616",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.963363266391!2d28.97758631541538!3d41.04792097929681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2sTuring%20Otomobil%20Kurumu!5e0!3m2!1str!2str!4v1625667000000!5m2!1str!2str"
};

const ContactPage = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm(); // Form instance to reset it later
    const [loading, setLoading] = useState(false);
    
    const onFinish = async (values) => {
        setLoading(true);
        try {
            await sendContactMessage(values);
            message.success('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.');
            form.resetFields(); // Clean the form
        } catch (error) {
            message.error('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
                Bizimle İletişime Geçin
            </Title>

            <Row gutter={[32, 32]}>
                
                {/* Left Column: Contact Form */}
                <Col xs={24} lg={12}>
                    <Card title="Bize Mesaj Gönderin">
                        <Form
                            form={form} // Attach form instance
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
                                rules={[
                                    { required: true, message: 'Lütfen e-posta girin!' },
                                    { type: 'email', message: 'Geçersiz e-posta formatı!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Mesajınız"
                                rules={[{ required: true, message: 'Lütfen mesajınızı girin!' }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    Gönder
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Right Column: Info and Map */}
                <Col xs={24} lg={12}>
                    <Card title="İletişim Bilgileri" style={{ marginBottom: 20 }}>
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
                    
                    <Title level={5} style={{ marginTop: 20 }}>Konumumuz</Title>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
                        <iframe
                            src={CONTACT_INFO.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ 
                                border: 0, 
                                position: 'absolute', 
                                top: 0, 
                                left: 0 
                            }} 
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