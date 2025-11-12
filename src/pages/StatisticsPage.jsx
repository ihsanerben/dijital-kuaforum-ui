import React from 'react';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const StatisticsPage = () => {
  return (
    <Content style={{ padding: '24px', minHeight: 280 }}>
      <Title level={2}>İstatistik ve Satış Raporları</Title>
      <p>Bu sayfa, randevu ve satış verilerine dayalı istatistikleri (Aşama 2'de) gösterecektir.</p>
    </Content>
  );
};

export default StatisticsPage;