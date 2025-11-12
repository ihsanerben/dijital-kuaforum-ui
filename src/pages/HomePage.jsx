// src/pages/HomePage.jsx GÜNCELLENMİŞ KOD

import React from 'react';
import { Typography, Row, Col, Card, Button } from 'antd';
import { CalendarOutlined, HeartOutlined, DollarOutlined } from '@ant-design/icons';
import PublicLayout from '../components/PublicLayout';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <PublicLayout>
      <div style={{ textAlign: 'center', padding: '40px 0', background: '#f0f2f5' }}>
        <Title level={1} style={{ color: '#001529' }}>Mükemmel Görünüm, Kusursuz Randevu Deneyimi</Title>
        <Paragraph style={{ fontSize: '18px', color: '#595959' }}>
          Kuaförünüzde kaliteli hizmeti en kolay şekilde planlayın. Sadece birkaç tıkla yerinizi ayırtın.
        </Paragraph>
        <Button type="primary" size="large" icon={<CalendarOutlined />} style={{ marginTop: 20 }}>
            Hemen Randevu Al!
        </Button>
      </div>

      <Title level={2} style={{ marginTop: 40, textAlign: 'center' }}>Neden Bizi Tercih Etmelisiniz?</Title>
      
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card title="Online Randevu" bordered={false}>
            <CalendarOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '10px' }} />
            <Paragraph>7/24 randevu oluşturma kolaylığı. Boş saatleri anında görün ve planlayın.</Paragraph>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Deneyimli Uzmanlar" bordered={false}>
            <HeartOutlined style={{ fontSize: '32px', color: '#f5222d', marginBottom: '10px' }} />
            <Paragraph>Alanında uzman, yenilikçi ve güler yüzlü ekibimizle tanışın.</Paragraph>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Şeffaf Fiyatlandırma" bordered={false}>
            <DollarOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '10px' }} />
            <Paragraph>Gizli ücret yok! Tüm hizmetlerimizin fiyatlarını net bir şekilde görün.</Paragraph>
          </Card>
        </Col>
      </Row>
    </PublicLayout>
  );
};

export default HomePage;