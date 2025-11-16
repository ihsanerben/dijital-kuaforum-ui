// src/components/DashboardLayout.jsx - SABİT SİDEBAR & OUTLET KULLANIMI

import React from 'react';
import { Layout, Menu, Button, theme, Typography, message } from 'antd';
import { TeamOutlined, CalendarOutlined, PieChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // Outlet import edildi
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
    label: 'İstatistik & Raporlar',
  },
];

// children prop'u kaldırıldı
const DashboardLayout = () => { 

  const [messageApi, contextHolder] = message.useMessage();


  const navigate = useNavigate();
  const location = useLocation(); 
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };
  
  const handleLogout = () => {
      clearAdminAuthData(); 
      messageApi.success('Başarıyla çıkış yapıldı.');

      setTimeout(() => {
        navigate('/adminGiris', { replace: true }); 
      }, 1000);       
  };

  // Menüde aktif olan öğeyi belirler
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '/adminCalendar';

  return (
    <>  
    {contextHolder}
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sol Kenar Çubuğu (SABİT SİDEBAR) */}
      <Sider 
        width={200} // Sabit genişlik
        style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed', 
            left: 0,
            top: 0,
            bottom: 0,
        }}
      >
        <div style={{ height: 32, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Title level={4} style={{ color: 'white', margin: 0 }}>
                RD Yönetim
            </Title>
        </div>
        <Menu 
          theme="dark" 
          selectedKeys={[selectedKey]}
          mode="inline" 
          items={menuItems} 
          onClick={handleMenuClick} 
        />
      </Sider>
      
      <Layout 
          // İçerik, sidebar genişliği kadar sağa kaydırıldı
          style={{ marginLeft: 200 }}
      >
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
          {/* İç rotaların içeriği burada gösterilir */}
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
    </>
  );
};

export default DashboardLayout;