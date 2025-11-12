// src/components/PublicLayout.jsx GÜNCELLENMİŞ KOD

import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const publicMenuItems = [
  { key: '/', label: 'Anasayfa' },
  { key: '/prices', label: 'Fiyat Listesi' },
  { key: '/services', label: 'Hizmetlerimiz' },
  { key: '/about', label: 'Hakkımızda' },
  { key: '/login', label: 'Kuaför Girişi' },
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
  
  // URL'e göre menüde hangi öğenin aktif olduğunu belirle
  const selectedKey = publicMenuItems.find(item => location.pathname === item.key)?.key || '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Üst Başlık (Header) */}
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
        {/* BURASI GÜNCELLENDİ: Tıklanabilir hale geldi */}
        <div 
            style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginRight: '40px', 
                cursor: 'pointer' // Tıklanabilir olduğunu göstermek için
            }}
            onClick={() => navigate('/')} // Anasayfaya yönlendirme
        >
            Kuaförüm
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={publicMenuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      
      {/* Ana İçerik Alanı */}
      <Content
        style={{
          padding: '24px 50px',
          minHeight: 280,
          background: colorBgContainer,
        }}
      >
        {children}
      </Content>
      
      {/* Footer */}
      <Footer style={{ textAlign: 'center' }}>
        Kuaför Yönetim Sistemi ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default PublicLayout;