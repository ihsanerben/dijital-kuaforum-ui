// src/pages/ServicesPage.jsx - GÜNCEL KOD

import React, { useState, useEffect } from 'react';
import { Typography, List, Card, Spin, App } from 'antd'; // Spin, App eklendi
import PublicLayout from '../components/PublicLayout'; 
import { getAllHizmetler } from '../api/hizmetService'; // API import edildi

const { Title, Paragraph } = Typography;

const ServicesPage = () => {
    const { message } = App.useApp();
    const [hizmetler, setHizmetler] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const response = await getAllHizmetler();
                
                // Backend'den gelen veriyi List bileşenine uygun formata dönüştür
                const formattedData = (response.data || []).map(h => ({
                    id: h.id,
                    title: h.ad, 
                    // Fiyat ve süre bilgisini kart içeriğine ekleyelim
                    description: `${h.ad} hizmeti ortalama ${h.sureDakika} dakika sürer.`, 
                }));
                
                setHizmetler(formattedData);
            } catch (error) {
                message.error('Hizmetler listesi yüklenemedi. Sunucuya ulaşılamıyor.');
                console.error('Hizmetler Sayfası Hatası:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [message]);


  return (
    <PublicLayout>
      <Title level={2}>Hizmetlerimiz</Title>
      <Paragraph>
        Kuaförümüzün sunduğu başlıca hizmetler aşağıdadır. Detaylı süre ve fiyat bilgisi için Fiyat Listesi sayfamızı ziyaret edebilirsiniz.
      </Paragraph>
      <Spin spinning={loading}>
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
            dataSource={hizmetler} // Dinamik veri kullanıldı
            renderItem={(item) => (
            <List.Item>
                <Card title={item.title}>{item.description}</Card>
            </List.Item>
            )}
            locale={{ emptyText: "Henüz tanımlanmış hizmet bulunmamaktadır." }}
        />
      </Spin>
    </PublicLayout>
  );
};

export default ServicesPage;