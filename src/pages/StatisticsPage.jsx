// src/pages/StatisticsPage.jsx - TEMİZLENMİŞ HAL

import React from 'react';
import { Typography, Empty } from 'antd';
// DashboardLayout importu SİLİNDİ

const { Title, Text } = Typography;

const StatisticsPage = () => {
    return (
        // DashboardLayout'suz sadece içeriği döndürüyoruz
        <>
            <Title level={2}>İstatistik ve Satış Raporları</Title>
            <Text>Bu sayfa, randevu ve satış verilerine dayalı istatistikleri (Aşama 4'te) gösterecektir.</Text>
            <Empty description="Veri bekleniyor..." style={{ marginTop: 50 }} />
        </>
    );
};

export default StatisticsPage;