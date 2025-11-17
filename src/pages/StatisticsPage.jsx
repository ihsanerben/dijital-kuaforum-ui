// src/pages/StatisticsPage.jsx - FİNAL KOD

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Spin, App, DatePicker, Select } from 'antd'; // Antd bileşenleri
import { getAdminStatistics } from '../api/appointmentService'; // API servisi
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker; // Tarih aralığı seçimi için

const StatisticsPage = () => {
    // message servisine güvenli erişim
    const { message } = App.useApp(); 

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    // İleride filtreleme için kullanılacak state'ler
    const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]); 
    const [period, setPeriod] = useState('monthly'); // Varsayılan olarak aylık

    const fetchStats = async () => {
        // Not: Şu anki backend API'miz filtreleme yapmadığı için, 
        // tüm zamanların verisini çekiyoruz. İleride tarih aralığı eklenecektir.
        setLoading(true);
        try {
            const response = await getAdminStatistics(dateRange); // API call
            setStats(response.data);
        } catch (error) {
            message.error("İstatistikler yüklenirken yetki veya sunucu hatası oluştu.");
            console.error("İstatistik Hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Bu hook'u filtreleme yapıldığında da tetikleyebiliriz: [dateRange, period]
    }, []); 

    return (
        <>
            <Title level={2}>İstatistik ve Satış Raporları</Title>
            
            {/* --- FİLTRELEME ALANI (İleride Geliştirilecek) --- */}
            <Row gutter={16} align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Text strong>Veri Periyodu:</Text>
                </Col>
                <Col>
                    <RangePicker 
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ width: 250 }}
                        // İleride buraya Apply butonu eklenebilir.
                    />
                </Col>
                {/* <Col>
                    <Button type="primary" onClick={fetchStats}>Raporu Güncelle</Button>
                </Col>
                */}
            </Row>
            
            <Spin spinning={loading}>
                <Row gutter={16}>
                    
                    {/* TOPLAM GELİR KARTI */}
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Toplam Gelir (₺)"
                                // Backend'den gelen 'toplamGelir' alanını kullanır
                                value={stats?.toplamGelir || 0}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<DollarOutlined />}
                                suffix="TL"
                            />
                        </Card>
                    </Col>
                    
                    {/* TAMAMLANAN RANDEVU SAYISI KARTI */}
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Tamamlanan Randevu Sayısı"
                                value={stats?.tamamlanmisRandevuSayisi || 0}
                                valueStyle={{ color: '#0050b3' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    
                    {/* BEKLEYEN RANDEVU SAYISI KARTI */}
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic
                                title="Bekleyen Randevu Sayısı"
                                value={stats?.beklemedeRandevuSayisi || 0}
                                valueStyle={{ color: '#faad14' }}
                                prefix={<ClockCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    
                </Row>
                
                <div style={{ marginTop: 40 }}>
                    <Title level={4}>Hizmet Dağılım Grafiği (Aşama 4.4)</Title>
                    <Text>Bu alana hizmetlerin yüzdelik kullanımını gösteren bir grafik eklenecektir.</Text>
                </div>

            </Spin>
        </>
    );
};

export default StatisticsPage;