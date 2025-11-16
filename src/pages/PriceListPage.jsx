// src/pages/PriceListPage.jsx - GÜNCEL KOD

import React, { useState, useEffect } from 'react';
import { Typography, Table, Spin, App } from 'antd'; // Spin, App eklendi
import PublicLayout from '../components/PublicLayout'; 
import { getAllHizmetler } from '../api/hizmetService'; // API import edildi

const { Title } = Typography;

const PriceListPage = () => {
    const { message } = App.useApp();
    const [hizmetler, setHizmetler] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            setLoading(true);
            try {
                const response = await getAllHizmetler();
                
                // Backend'den gelen veriyi tabloya uygun formata dönüştür
                const formattedData = (response.data || []).map(h => ({
                    key: h.id, 
                    service: h.ad, 
                    duration: `${h.sureDakika} dakika`, 
                    price: `${h.fiyat} TL`,
                }));
                
                setHizmetler(formattedData);
            } catch (error) {
                message.error('Fiyat listesi yüklenemedi. Sunucuya ulaşılamıyor.');
                console.error('Fiyat Listesi Hatası:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, [message]);

    const priceColumns = [
        { title: 'Hizmet', dataIndex: 'service', key: 'service' },
        { title: 'Süre', dataIndex: 'duration', key: 'duration' },
        { title: 'Fiyat', dataIndex: 'price', key: 'price' },
    ];

    return (
        <PublicLayout>
            <Title level={2}>Fiyat Listesi</Title>
            <Spin spinning={loading}>
                <Table 
                    columns={priceColumns} 
                    dataSource={hizmetler} // Dinamik veri kullanıldı
                    pagination={false} 
                    bordered
                    locale={{ emptyText: "Henüz tanımlanmış hizmet bulunmamaktadır." }}
                />
            </Spin>
            <p style={{ marginTop: '20px' }}>
                Belirtilen süreler ortalama sürelerdir ve seçilen hizmetlere göre değişiklik gösterebilir.
            </p>
        </PublicLayout>
    );
};

export default PriceListPage;