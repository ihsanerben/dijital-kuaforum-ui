// src/pages/StatisticsPage.jsx - FİNAL KOD (GRAFİK EKLENDİ)

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Spin, App, DatePicker, Progress, Space } from 'antd'; // Progress eklendi
import { getAdminStatistics } from '../api/appointmentService';
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Simülasyon verisi: Normalde Backend'den gelmeli
const simulatedServiceData = [
    { name: 'Saç Kesimi', count: 45 },
    { name: 'Sakal Traşı', count: 35 },
    { name: 'Saç Boyama', count: 12 },
    { name: 'Cilt Bakımı', count: 8 },
];

// Bar Grafiği Bileşeni
const ServiceBar = ({ name, count, total }) => {
    const percent = total > 0 ? (count / total) * 100 : 0;
    const color = percent > 60 ? '#1890ff' : percent > 30 ? '#52c41a' : '#faad14';

    return (
        <div style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 13, display: 'block' }}>{name} ({count} Adet)</Text>
            <Progress 
                percent={parseFloat(percent.toFixed(1))} 
                status="active" 
                showInfo={true}
                strokeColor={color}
            />
        </div>
    );
};


const StatisticsPage = () => {
    const { message } = App.useApp();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]); 
    
    // Toplam hizmet sayısını hesapla (grafik için)
    const totalServicesRendered = simulatedServiceData.reduce((sum, item) => sum + item.count, 0);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Backend'deki 500 hatasını çözmek için, API çağrısının çalışması gerekiyor.
            // Başarılı olduğunu varsayarak devam ediyoruz.
            const response = await getAdminStatistics(dateRange); 
            setStats(response.data);
        } catch (error) {
            message.error("İstatistikler yüklenirken yetki/sunucu hatası oluştu. (500 Error)");
            console.error("İstatistik Hatası:", error);
            // Frontend'de veriler gelmezse 0 gösteririz
            setStats({ toplamGelir: 0, tamamlanmisRandevuSayisi: 0, beklemedeRandevuSayisi: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []); 

    return (
        <>
            <Title level={2}>İstatistik ve Satış Raporları</Title>
            
            {/* --- FİLTRELEME ALANI --- */}
            <Row gutter={16} align="middle" style={{ marginBottom: 30 }}>
                <Col>
                    <Text strong>Veri Periyodu:</Text>
                </Col>
                <Col>
                    <RangePicker 
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ width: 300 }}
                        // Güncelleme butonu yerine fetchStats'ı tetikleyebiliriz
                        onOpenChange={(open) => !open && fetchStats()} 
                    />
                </Col>
            </Row>
            
            <Spin spinning={loading}>
                <Row gutter={24} style={{ marginBottom: 40 }}>
                    
                    {/* TOPLAM GELİR KARTI */}
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Toplam Gelir"
                                value={stats?.toplamGelir || 0}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<DollarOutlined />}
                                suffix="TL"
                            />
                        </Card>
                    </Col>
                    
                    {/* RANDEVU SAYISI KARTLARI */}
                    <Col span={8}>
                        <Card bordered={false}>
                             <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                 <Statistic
                                    title="Tamamlanan Randevu Sayısı"
                                    value={stats?.tamamlanmisRandevuSayisi || 0}
                                    valueStyle={{ color: '#0050b3' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                                <Statistic
                                    title="Bekleyen Randevu Sayısı"
                                    value={stats?.beklemedeRandevuSayisi || 0}
                                    valueStyle={{ color: '#faad14' }}
                                    prefix={<ClockCircleOutlined />}
                                />
                             </Space>
                        </Card>
                    </Col>

                    {/* MÜŞTERİ SAYISI (Simülasyon) */}
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Toplam Müşteri Ziyareti"
                                value={stats?.tamamlanmisRandevuSayisi || 0}
                                valueStyle={{ color: '#595959' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    
                </Row>
                
                {/* --- HİZMET DAĞILIM GRAFİĞİ ALANI --- */}
                <Card title="Hizmet Dağılım Grafiği (Yüzdelik)" style={{ marginTop: 20 }}>
                    <Text type="secondary">
                        Belirtilen periyotta en çok alınan hizmetlerin yüzdelik dağılımı:
                    </Text>
                    <div style={{ marginTop: 20 }}>
                        {simulatedServiceData.map((item, index) => (
                            <ServiceBar 
                                key={index}
                                name={item.name}
                                count={item.count}
                                total={totalServicesRendered}
                            />
                        ))}
                    </div>
                </Card>

            </Spin>
        </>
    );
};

export default StatisticsPage;