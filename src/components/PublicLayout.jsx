// src/components/PublicLayout.jsx

import React from 'react';
import { Layout, Menu, theme, Button, Row, Col, Typography, Divider } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginOutlined, FacebookFilled, InstagramFilled, TwitterSquareFilled, YoutubeFilled, ArrowRightOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Link } = Typography;

// Menü öğeleri - İletişim eklendi
const publicMenuItems = [
  { key: '/', label: 'Anasayfa' },
  { key: '/about', label: 'Hakkımızda' },
  { key: '/services', label: 'Hizmetlerimiz' },
  { key: '/prices', label: 'Fiyat Listesi' },
  { key: '/contact', label: 'İletişim' }, 
];

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const selectedKey = publicMenuItems.find(item => location.pathname === item.key)?.key || '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Üst Başlık (Header) - Sabitlenmiş ve Sıfır Noktasına Yapışık */}
      <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#001529',
          padding: '0 50px',
          position: 'fixed',
          zIndex: 10,
          width: '100%',
          top: 0 
      }}>
        {/* Sol Taraftaki Başlık (Logo) */}
        <div 
            style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                marginRight: 'auto' 
            }}
            onClick={() => navigate('/')}
        >
            Kuaför Yönetim
        </div>
        
        {/* Sağ Taraftaki Menü ve Buton */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={publicMenuItems}
          onClick={handleMenuClick}
          style={{ borderBottom: 'none' }} 
        />
        
        {/* KUAOFR GİRİŞ BUTONU */}
        <Button 
          type="primary" 
          onClick={handleLoginClick} 
          icon={<LoginOutlined />}
          style={{ marginLeft: '20px' }} 
        >
          Kuaför Girişi
        </Button>
      </Header>
      
      {/* Content - Header yüksekliği kadar üstten boşluk verilerek içeriğin kayması önlendi */}
      <Content
        style={{
          padding: '64px 50px 24px 50px', 
          minHeight: 280,
          background: colorBgContainer,
        }}
      >
        {children}
      </Content>
      
      {/* FOOTER KISMI */}
      <Footer style={{ backgroundColor: '#f0f2f5', padding: '40px 50px 10px' }}>
        <Row gutter={[32, 32]} justify="center"> 
          
          {/* SÜTUN 1: Logo ve Tanıtım */}
          <Col xs={24} md={10}> 
            <Title level={4} style={{ marginBottom: 15, color: '#695acb' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>dijital</span>Kuaför
            </Title>
            <Paragraph style={{ color: '#595959' }}>
              Kuaför salonlarına özel dijital yazılım çözümleri sunuyoruz. Müşteri memnuniyetini en üst seviyeye taşımak için buradayız.
            </Paragraph>
            <div style={{ marginTop: 15 }}>
              <FacebookFilled style={{ fontSize: '24px', marginRight: 10, color: '#444' }} />
              <InstagramFilled style={{ fontSize: '24px', marginRight: 10, color: '#444' }} />
              <TwitterSquareFilled style={{ fontSize: '24px', marginRight: 10, color: '#444' }} />
              <YoutubeFilled style={{ fontSize: '24px', color: '#444' }} />
            </div>
          </Col>

          {/* SÜTUN 2: BİZİMLE İLETİŞİME GEÇİN */}
          <Col xs={24} md={10} style={{ marginLeft: 'auto' }}> 
            <Title level={5} style={{ color: '#000', marginBottom: 15 }}>
              <ArrowRightOutlined style={{ marginRight: 8, color: '#695acb' }} /> Bizimle İletişime Geçin
            </Title>
            <Paragraph style={{ color: '#595959', marginBottom: 10 }}>
              <HomeOutlined style={{ marginRight: 8, color: '#695acb' }} /> Altınşehir Mahallesi Kral Sokak No: 1453 Daire: 7
            </Paragraph>
            <Paragraph style={{ color: '#595959', marginBottom: 10 }}>
              <MailOutlined style={{ marginRight: 8, color: '#695acb' }} /> ihsanerben@gmail.com
            </Paragraph>
            <Paragraph style={{ color: '#595959' }}>
              <PhoneOutlined style={{ marginRight: 8, color: '#695acb' }} /> 0571 638 1453
            </Paragraph>
          </Col>
        </Row>
        
        <Divider style={{ margin: '20px 0 10px 0' }} />
        
        {/* En Alt Bant */}
        <Row justify="space-between" align="middle" style={{ padding: '10px 0' }}>
            <Col>
                <Paragraph style={{ color: '#8c8c8c', margin: 0 }}>
                    © Konasoft {new Date().getFullYear()} | Tüm Hakları Saklıdır
                </Paragraph>
            </Col>
            <Col>
                <Link href="#" style={{ color: '#8c8c8c', marginRight: 15 }}>Kullanım Şartları</Link>
                <Link href="#" style={{ color: '#8c8c8c', marginRight: 15 }}>Gizlilik Politikası</Link>
                <Link href="/contact" style={{ color: '#8c8c8c' }}>İletişim</Link>
            </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default PublicLayout;