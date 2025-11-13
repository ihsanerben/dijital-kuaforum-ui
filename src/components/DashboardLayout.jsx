// src/components/DashboardLayout.jsx (YENİ DOSYA)

import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Typography, message } from 'antd';
import { UserOutlined, CalendarOutlined, PieChartOutlined, LogoutOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAdminAuthData } from '../utils/storage'; 

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

// Admin Menü Öğeleri
const menuItems = [
  {
    key: '/adminCalendar',
    icon: <CalendarOutlined />,
    label: 'Randevu Yönetimi',
  },
  {
    key: '/customers',
    icon: <TeamOutlined />,
    label: 'Müşteri CRUD',
  },
  {
    key: '/statistics',
    icon: <PieChartOutlined />,
    label: 'İstatistik ve Raporlar',
  },
];

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };
  
  const handleLogout = () => {
      clearAdminAuthData(); // Admin (Kuaför) Local Storage verisini temizle
      message.success('Başarıyla çıkış yapıldı.');
      navigate('/adminGiris', { replace: true }); // Gizli Admin Giriş sayfasına yönlendir
  };

  // Geçerli yolu kullanarak menüdeki aktif öğeyi belirle
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '/adminCalendar';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sol Kenar Çubuğu (Sidebar) */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="80"
      >
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Title level={5} style={{ color: 'white', margin: 0 }}>
                {collapsed ? 'Rİ' : 'Rıdvan Cengiz'}
            </Title>
        </div>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={[selectedKey]} 
          selectedKeys={[selectedKey]}
          mode="inline" 
          items={menuItems} 
          onClick={handleMenuClick} 
        />
      </Sider>
      
      <Layout>
        {/* Başlık Çubuğu (Header) */}
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                    marginRight: 24,
                }}
            >
                Çıkış Yap
            </Button>
        </Header>
        
        {/* Ana İçerik Alanı */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;