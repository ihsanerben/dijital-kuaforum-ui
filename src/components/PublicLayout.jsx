// src/components/PublicLayout.jsx - FİNAL FOOTER VE SOSYAL MEDYA GÜNCELLEMESİ

import React from 'react';
import { Layout, Menu, theme, Button, Row, Col, Typography, Divider, Space } from 'antd';
// YENİ İKONLAR İÇİN IMPORT EKLENDİ
import { LoginOutlined, CalendarOutlined, InstagramOutlined, LinkedinFilled,LogoutOutlined, GithubOutlined, GlobalOutlined, CodeOutlined, ArrowRightOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { isCustomerLoggedIn, clearCustomerAuthData } from '../utils/storage'; 
import { logoutCustomer } from '../api/customerAuthService'; 

// Logo görseli import edildi (Varsayılıyor)
import logoImage from '../images/logo.png'; 

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Link, Text } = Typography;

// YENİ SOSYAL MEDYA LİNKLERİ
const socialLinks = [
    { icon: <InstagramOutlined style={{ color: '#E1306C' }} />, url: 'https://www.instagram.com/ihsanerben/', title: 'Instagram' },
    { icon: <LinkedinFilled style={{ color: '#0A66C2' }} />, url: 'https://www.linkedin.com/in/ihsanerben/', title: 'LinkedIn' },
    { icon: <GithubOutlined style={{ color: '#333' }} />, url: 'https://github.com/ihsanerben', title: 'GitHub' },
    { icon: <GlobalOutlined style={{ color: '#007ACC' }} />, url: 'https://ihsanerben.netlify.app/', title: 'Web Sitesi' },
    { icon: <CodeOutlined style={{ color: '#FF9900' }} />, url: 'https://leetcode.com/u/ihsanerben/', title: 'LeetCode' },
];

const publicMenuItems = [
    { key: '/calendar', icon: <CalendarOutlined />, label: 'Haftalık Randevu Takvimi' },
    { key: '/', label: 'Anasayfa' },
    { key: '/services', label: 'Hizmetlerimiz' },
    { key: '/prices', label: 'Fiyat Listesi' },
    { key: '/contact', label: 'İletişim' }, 
    { key: '/about', label: 'Hakkımızda' },
];

const PublicLayout = ({ children }) => {
// ... (Diğer fonksiyonlar aynı kalır) ...
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isCustomerLoggedIn();
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };
  
  const handleUserAuthClick = () => {
    navigate('/userAuth');
  };
  
  const handleLogoutClick = () => {
    logoutCustomer(); 
    navigate('/', { replace: true }); 
  };
  
  const selectedKey = publicMenuItems.find(item => location.pathname === item.key)?.key || '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* HEADER (AYNI KALIR) */}
      <Header style={{ 
          display: 'flex', alignItems: 'center', background: '#001529', padding: '0 50px',
          position: 'fixed', zIndex: 10, width: '100%', top: 0 
      }}>
        {/* Sol Taraftaki Başlık (LOGO) */}
        <div 
            style={{ 
                color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                marginRight: 'auto', display: 'flex', alignItems: 'center',
            }}
            onClick={() => navigate('/')}
        >
            <img 
                src={logoImage} 
                alt="Rıdvan Cengiz Dijital Kuaförüm Logo" 
                style={{ height: '32px', marginRight: '8px', objectFit: 'contain' }}
            />
            Rıdvan Cengiz Dijital Kuaförüm
        </div>
        
        {/* Sağ Taraftaki Menü ve Buton (AYNI KALIR) */}
        <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} items={publicMenuItems} onClick={handleMenuClick} style={{ borderBottom: 'none' }} />
        {loggedIn ? (
            <Button type="primary" onClick={handleLogoutClick} icon={<LogoutOutlined />} style={{ marginLeft: '10px' }}>Çıkış Yap</Button>
        ) : (
            <Button type="primary" onClick={handleUserAuthClick} icon={<LoginOutlined />} style={{ marginLeft: '10px' }}>Giriş Yap / Üye Ol</Button>
        )}
      </Header>
      
      {/* CONTENT (AYNI KALIR) */}
      <Content style={{ padding: '64px 50px 24px 50px', minHeight: 280, background: colorBgContainer }} >{children}</Content>
      
      {/* YENİ VE GÖRSEL OLARAK GÜÇLENDİRİLMİŞ FOOTER */}
      <Footer style={{ backgroundColor: '#e9e9e9', padding: '40px 50px 10px', borderTop: '1px solid #d9d9d9' }}>
        <Row gutter={[32, 32]}>
          
          {/* SÜTUN 1: Logo, Tanıtım ve Sosyal Medya */}
          <Col xs={24} md={12}> 
            <Title level={4} style={{ marginBottom: 15, color: '#695acb' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>dijital</span>Kuaför
            </Title>
            <Paragraph style={{ color: '#595959' }}>
              Kuaför salonlarına özel dijital yazılım çözümleri sunuyoruz. Müşteri memnuniyetini en üst seviyeye taşımak için buradayız.
            </Paragraph>
            
            {/* YENİ SOSYAL MEDYA BAĞLANTILARI */}
            <Space size="middle" style={{ marginTop: 20 }}>
                {socialLinks.map((link, index) => (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" title={link.title}>
                        <div style={{ fontSize: '24px', transition: 'transform 0.2s', color: '#444' }}>
                            {link.icon}
                        </div>
                    </a>
                ))}
            </Space>
          </Col>

          {/* SÜTUN 2: İletişim Bilgileri */}
          <Col xs={24} md={12} style={{ paddingLeft: '50px' }}> 
            <Title level={5} style={{ color: '#000', marginBottom: 20, borderBottom: '2px solid #695acb', paddingBottom: 5 }}>
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
        
        <Divider style={{ margin: '30px 0 10px 0' }} />
        
        {/* En Alt Bant (Copyright) */}
        <Row justify="space-between" align="middle" style={{ padding: '10px 0' }}>
            <Col>
                <Paragraph style={{ color: '#8c8c8c', margin: 0 }}>
                    © ihsansoft {new Date().getFullYear()} | Tüm Hakları Saklıdır | İhlal edeni ağır sikerim.
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