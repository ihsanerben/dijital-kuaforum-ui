// src/pages/HomePage.jsx - FİNAL VE EKSİKSİZ KOD

import React from 'react';
import { Typography, Row, Col, Card, Collapse } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import PublicLayout from '../components/PublicLayout';

// YEREL GÖRSEL IMPORTLARI (Lütfen yolların doğru olduğunu kontrol edin)
import img1 from '../images/img1.png'; // Ana banner
import img2 from '../images/img2.png'; // Özellik kartları ve SSS
import img3 from '../images/img3.png'; // SSS görseli

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

// SSS verileri
const faqData = [
  {
    header: 'Bu yazılım kimler için uygun?',
    content: 'Kuaförler, güzellik salonları ve bireysel çalışan profesyoneller için tasarlanmıştır.',
  },
  {
    header: 'Randevu hatırlatma SMS/WhatsApp gönderiyor mu?',
    content: 'Sistem altyapısı mevcuttur. Harici servis entegrasyonu (Twilio/MessageBird vb.) ile otomatik SMS/WhatsApp hatırlatmaları yapılabilir.',
  },
  {
    header: 'İnternet bağlantısı olmadan çalışır mı?',
    content: 'Hayır, randevu ve müşteri verileri anlık olarak bulut tabanlı sistemde tutulduğu için aktif internet bağlantısı gereklidir.',
  },
  {
    header: 'Kasa takibi yapılabiliyor mu?',
    content: 'Evet, yönetici panelindeki İstatistik ve Raporlar sayfası (Aşama 4) günlük kazanç ve gider takibi için tasarlanacaktır.',
  },
];

// Yeni görsel render bileşeni
const ImageContainer = ({ src, alt, height = '100%' }) => (
    <img 
        src={src} 
        alt={alt} 
        style={{ width: '100%', height: height, objectFit: 'cover', borderRadius: 8 }}
    />
);


const HomePage = () => {
  return (
    <PublicLayout>
      
      {/* 1. BLOK: Genel Tanıtım ve Görsel */}
      <Row gutter={48} align="middle" style={{ marginBottom: 60 }}>
        <Col xs={24} md={12}>
          <Title level={2} style={{ color: '#695acb', fontSize: '40px' }}>
            Modern kuaförler için geliştirilen yazılımla işlerinizi kolayca yönetin.
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#595959' }}>
            Müşteri deneyimini artırın, iş yükünüzü azaltın, kazancınızı büyütün.
          </Paragraph>
        </Col>
        <Col xs={24} md={12}>
          {/* GÖRSEL ALANI 1: img1.png */}
          <div style={{ marginTop: 50, height: 550, width: '100%', background: '#f0f2f5', borderRadius: 8 }}>
            <ImageContainer src={img1} alt="Modern Kuaför Salonu" height="550px" />
          </div> 
        </Col>
      </Row>

      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#8e44ad' }}>
          Kuaför Olarak Tüm İhtiyaçlarınız Tek Ekranda
        </Title>
      </div>

      {/* 2. BLOK: Özellikler (6 Kart) */}
      <Row gutter={[32, 32]} style={{ marginBottom: 60 }}>
        
        {/* Card 1: Randevu Takip */}
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable cover={<div style={{ height: 180, width: '100%' }}><ImageContainer src={img2} alt="Randevu Takip Ekranı" height="180px" /></div>}>
            <Card.Meta title="Randevu Takip Sistemi" description="Müşterilerinizin randevularını tek tıkla planlayın, iptal edin ya da yeniden düzenleyin." />
          </Card>
        </Col>
        {/* Card 2: Müşteri Bilgi Yönetimi */}
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable cover={<div style={{ height: 180, width: '100%' }}><ImageContainer src={img2} alt="Müşteri Bilgi Yönetimi Ekranı" height="180px" /></div>}>
            <Card.Meta title="Müşteri Bilgi Yönetimi" description="Müşterilerinizi tanıyın, geçmiş, favorileri ve notlarıyla daha kişisel hizmet sunun." />
          </Card>
        </Col>
        {/* Card 3: Gelir-Gider Takibi */}
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable cover={<div style={{ height: 180, width: '100%' }}><ImageContainer src={img2} alt="Para Çantası ve Hesap Makinesi" height="180px" /></div>}>
            <Card.Meta title="Gelir-Gider Takibi" description="Günlük kazançları, giderleri ve kâr-zarar durumunu tek panelden takip edin." />
          </Card>
        </Col>
        {/* Card 4: Personel Takibi */}
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable cover={<div style={{ height: 180, width: '100%' }}><ImageContainer src={img2} alt="Personel Takip Ekranı" height="180px" /></div>}>
            <Card.Meta title="Personel Takibi" description="Vardiya, izin ve performans takibini kolayca yönetin." />
          </Card>
        </Col>
        {/* Card 5: Hizmet Listesi */}
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable cover={<div style={{ height: 180, width: '100%' }}><ImageContainer src={img2} alt="Kuaför Aletleri" height="180px" /></div>}>
            <Card.Meta title="Hizmet Listesi ve Fiyatlandırma" description="Hizmetlerinizi tanımlayın, fiyatlarını kolayca yönetin." />
          </Card>
        </Col>
        {/* Card 6: Ürün ve Stok */}
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable cover={<div style={{ height: 180, width: '100%' }}><ImageContainer src={img2} alt="Şampuan ve Kozmetik Ürünler" height="180px" /></div>}>
            <Card.Meta title="Ürün ve Stok Yönetimi" description="Bitmeden uyarılmalı, alarak stoklarınızı kontrol altında tutun." />
          </Card>
        </Col>
      </Row>

      {/* 3. BLOK: Sıkça Sorulan Sorular (SSS) */}
      <div style={{ padding: '40px 0', backgroundColor: '#f9f9f9', borderRadius: 8 }}>
        <Row gutter={48} align="top">
          <Col xs={24} md={12} style={{ paddingLeft: 40 }}>
            <Title level={4} style={{ color: '#695acb' }}>SSS</Title>
            <Title level={2} style={{ marginTop: 0 }}>SIKÇA SORULAN SORULAR</Title>
            <Paragraph>
              Kuaförler, güzellik salonları ve bireysel çalışan profesyoneller için sıkça sorulan soruları sizin için derledik.
            </Paragraph>
            <Collapse 
              accordion 
              bordered={false}
              expandIcon={({ isActive }) => <PlusOutlined rotate={isActive ? 45 : 0} style={{ color: '#695acb' }} />}
              style={{ background: 'transparent' }}
            >
              {faqData.map((item, index) => (
                <Panel header={item.header} key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <Paragraph style={{ paddingLeft: 24 }}>{item.content}</Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Col>
          <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* GÖRSEL ALANI 3: img3.png */}
            <div style={{ height: 600, width: '90%', borderRadius: 8 }}>
              <ImageContainer src={img3} alt="SSS Görseli" height="600px" />
            </div>
          </Col>
        </Row>
      </div>
      
    </PublicLayout>
  );
};

export default HomePage;