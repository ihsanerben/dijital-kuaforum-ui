// src/pages/HomePage.jsx GÜNCELLEMİŞ KOD (Rastgele Görsel URL'leri Eklendi)

import React from 'react';
import { Typography, Row, Col, Card, Collapse } from 'antd';
import { CalendarOutlined, SolutionOutlined, DollarOutlined, UserOutlined, SettingOutlined, BoxPlotOutlined, PlusOutlined } from '@ant-design/icons';
import PublicLayout from '../components/PublicLayout';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

// Rastgele Kuaför Temalı Görsel URL'leri (Unsplash/Pexels tarzı placeholder'lar)
const IMAGE_URLS = {
    // Geniş Görsel
    BARBER_BG: 'https://images.pexels.com/photos/1813247/pexels-photo-1813247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    // Randevu Sistemi
    APPOINTMENT: 'https://images.pexels.com/photos/257858/pexels-photo-257858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Müşteri Yönetimi (Genel Panel)
    CRM: 'https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Finans/Para
    FINANCE: 'https://images.pexels.com/photos/3377405/pexels-photo-3377405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Takvim/Personel
    PERSONNEL: 'https://images.pexels.com/photos/3762804/pexels-photo-3762804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Ürün/Stok
    STOCK: 'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // SSS (Berber Aletleri)
    FAQ_IMAGE: 'https://images.pexels.com/photos/7988899/pexels-photo-7988899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    // Genel Kuaför Aletleri
    TOOLS: 'https://images.pexels.com/photos/5623063/pexels-photo-5623063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
};

// SSS verileri (Aynı kalır)
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
    content: 'Evet, yönetici panelindeki İstatistik ve Raporlar sayfası (Aşama 2) günlük kazanç ve gider takibi için tasarlanacaktır.',
  },
];

// Tekrarlanan görsel stilini tanımlayan yardımcı bileşen
const ImagePlaceholder = ({ url, alt }) => (
    <div 
        style={{
            height: '100%',
            width: '100%',
            backgroundImage: `url(${url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 8,
            minHeight: '180px' // Kart kapakları için minimum yükseklik
        }}
        aria-label={alt}
        role="img"
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
          {/* GÖRSEL ALANI 1 */}
          <ImagePlaceholder url={IMAGE_URLS.BARBER_BG} alt="Modern Kuaför Salonu" />
        </Col>
      </Row>

      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#8e44ad' }}>
          Kuaför Olarak Tüm İhtiyaçlarınız Tek Ekranda
        </Title>
      </div>

      {/* 2. BLOK: Özellikler (6 Kart) */}
      <Row gutter={[32, 32]} style={{ marginBottom: 60 }}>
        {/* Kart 1: Randevu Takip */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable
            cover={<ImagePlaceholder url={IMAGE_URLS.APPOINTMENT} alt="Randevu Takip Ekranı" />} 
          >
            <Card.Meta 
              title="Randevu Takip Sistemi" 
              description="Müşterilerinizin randevularını tek tıkla planlayın, iptal edin ya da yeniden düzenleyin."
            />
          </Card>
        </Col>
        {/* Kart 2: Müşteri Bilgi Yönetimi */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable
            cover={<ImagePlaceholder url={IMAGE_URLS.CRM} alt="Müşteri Bilgi Yönetimi Ekranı" />} 
          >
            <Card.Meta 
              title="Müşteri Bilgi Yönetimi" 
              description="Müşterilerinizi tanıyın, geçmiş, favorileri ve notlarıyla daha kişisel hizmet sunun."
            />
          </Card>
        </Col>
        {/* Kart 3: Gelir-Gider Takibi */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable
            cover={<ImagePlaceholder url={IMAGE_URLS.FINANCE} alt="Para Çantası ve Hesap Makinesi" />} 
          >
            <Card.Meta 
              title="Gelir-Gider Takibi" 
              description="Günlük kazançları, giderleri ve kâr-zarar durumunu tek panelden takip edin."
            />
          </Card>
        </Col>
        {/* Kart 4: Personel Takibi */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable
            cover={<ImagePlaceholder url={IMAGE_URLS.PERSONNEL} alt="Personel Takip Ekranı" />} 
          >
            <Card.Meta 
              title="Personel Takibi" 
              description="Vardiya, izin ve performans takibini kolayca yönetin."
            />
          </Card>
        </Col>
        {/* Kart 5: Hizmet Listesi */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable
            cover={<ImagePlaceholder url={IMAGE_URLS.TOOLS} alt="Kuaför Aletleri" />} 
          >
            <Card.Meta 
              title="Hizmet Listesi ve Fiyatlandırma" 
              description="Hizmetlerinizi tanımlayın, fiyatlarını kolayca yönetin."
            />
          </Card>
        </Col>
        {/* Kart 6: Ürün ve Stok */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable
            cover={<ImagePlaceholder url={IMAGE_URLS.STOCK} alt="Şampuan ve Kozmetik Ürünler" />} 
          >
            <Card.Meta 
              title="Ürün ve Stok Yönetimi" 
              description="Bitmeden uyarılmalı, alarak stoklarınızı kontrol altında tutun."
            />
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
            <img src="https://dijitalkuafor.com/static/theme/img/forSss.webp" alt="" />
            <div style={{ height: 400, width: '90%', borderRadius: 8 }}>
                <ImagePlaceholder url={IMAGE_URLS.FAQ_IMAGE} alt="Tıraş Bıçağı ve Tarak" />
            </div>
          </Col>
        </Row>
      </div>
      
    </PublicLayout>
  );
};

export default HomePage;