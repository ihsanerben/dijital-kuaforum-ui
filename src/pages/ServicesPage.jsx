// src/pages/ServicesPage.jsx

import React from 'react';
import { Typography, List, Card } from 'antd';
// PublicLayout import edildi
import PublicLayout from '../components/PublicLayout'; 

const { Title, Paragraph } = Typography;

const servicesData = [
    { title: 'Saç Kesimi', description: 'Modern ve klasik saç kesim teknikleri.' },
    { title: 'Sakal Tıraşı ve Bakımı', description: 'Sıcak havlu eşliğinde geleneksel sakal tıraşı.' },
    { title: 'Saç Boyama ve Röfle', description: 'Doğal görünümlü veya iddialı renk değişiklikleri.' },
    { title: 'Cilt Bakımı', description: 'Özel ürünlerle yüz maskesi ve nemlendirme.' },
];

const ServicesPage = () => {
  return (
    <PublicLayout>
      <Title level={2}>Hizmetlerimiz</Title>
      <Paragraph>
        Kuaförümüzün sunduğu başlıca hizmetler aşağıdadır. Detaylı süre ve fiyat bilgisi için Fiyat Listesi sayfamızı ziyaret edebilirsiniz.
      </Paragraph>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
        dataSource={servicesData}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}>{item.description}</Card>
          </List.Item>
        )}
      />
    </PublicLayout>
  );
};

export default ServicesPage;