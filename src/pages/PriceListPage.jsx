// src/pages/PriceListPage.jsx

import React from 'react';
import { Typography, Table } from 'antd';
// PublicLayout import edildi
import PublicLayout from '../components/PublicLayout'; 

const { Title } = Typography;

const priceData = [
    { key: '1', service: 'Saç Kesimi', duration: '30 dakika', price: '250 TL' },
    { key: '2', service: 'Sakal Tıraşı', duration: '20 dakika', price: '150 TL' },
    { key: '3', service: 'Saç Yıkama + Fön', duration: '15 dakika', price: '100 TL' },
    { key: '4', service: 'Saç Boyama', duration: '40 dakika', price: '450 TL' },
];

const priceColumns = [
    { title: 'Hizmet', dataIndex: 'service', key: 'service' },
    { title: 'Süre', dataIndex: 'duration', key: 'duration' },
    { title: 'Fiyat', dataIndex: 'price', key: 'price' },
];

const PriceListPage = () => {
  return (
    <PublicLayout>
      <Title level={2}>Fiyat Listesi</Title>
      <Table 
        columns={priceColumns} 
        dataSource={priceData} 
        pagination={false} 
        bordered
      />
      <p style={{ marginTop: '20px' }}>
          Belirtilen süreler ortalama sürelerdir ve seçilen hizmetlere göre değişiklik gösterebilir.
      </p>
    </PublicLayout>
  );
};

export default PriceListPage;