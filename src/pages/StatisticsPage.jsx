// src/pages/StatisticsPage.jsx - FİNAL KOD

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Card, Statistic, Spin, App, DatePicker, Progress, Alert } from 'antd'; 
import { getGeneralStats } from '../api/appointmentService'; // Güncel Servis
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/tr';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
moment.locale('tr');

const StatisticsPage = () => {
    const { message } = App.useApp();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]); 

    const fetchStats = useCallback(async (start, end) => {
        setLoading(true);
        try {
            // Tarihleri formatla
            const sDate = start.format('YYYY-MM-DD');
            const eDate = end.format('YYYY-MM-DD');
            
            const response = await getGeneralStats(sDate, eDate);
            setStats(response.data);
        } catch (error) {
            message.error("İstatistikler alınamadı.");
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchStats(dateRange[0], dateRange[1]);
    }, []);

    return (
        <>
            <Title level={2}>Genel Dükkan İstatistikleri</Title>
            <Row gutter={16} align="middle" style={{ marginBottom: 30 }}>
                <Col><Text strong>Periyot:</Text></Col>
                <Col>
                    <RangePicker 
                        value={dateRange} 
                        onChange={(dates) => {
                            if(dates) { setDateRange(dates); fetchStats(dates[0], dates[1]); }
                        }} 
                        format="DD/MM/YYYY"
                    />
                </Col>
            </Row>
            
            <Spin spinning={loading}>
                <Row gutter={24} style={{ marginBottom: 40 }}>
                    <Col span={6}>
                        <Card><Statistic title="Toplam Ciro" value={stats?.totalRevenue || 0} precision={2} suffix="TL" prefix={<DollarOutlined />} valueStyle={{ color: '#3f8600' }} /></Card>
                    </Col>
                    <Col span={6}>
                        <Card><Statistic title="Tamamlanan Randevu" value={stats?.completedAppointments || 0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
                    </Col>
                    <Col span={6}>
                        <Card><Statistic title="Bekleyen Randevu" value={stats?.pendingAppointments || 0} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} /></Card>
                    </Col>
                    <Col span={6}>
                        <Card><Statistic title="Toplam Kayıtlı Müşteri" value={stats?.totalCustomers || 0} prefix={<TeamOutlined />} /></Card>
                    </Col>
                </Row>
                
                <Card title="Hizmet Dağılımı (En Çok Tercih Edilenler)" style={{ marginTop: 20 }}>
                    {stats?.serviceDistribution?.length > 0 ? (
                        stats.serviceDistribution.map((item, index) => {
                            const total = stats.serviceDistribution.reduce((sum, i) => sum + i.count, 0);
                            const percent = (item.count / total) * 100;
                            return (
                                <div key={index} style={{ marginBottom: 15 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>{item.name}</Text>
                                        <Text type="secondary">{item.count} Adet</Text>
                                    </div>
                                    <Progress percent={parseFloat(percent.toFixed(1))} status="active" />
                                </div>
                            );
                        })
                    ) : <Alert message="Bu tarih aralığında veri yok." type="info" showIcon />}
                </Card>
            </Spin>
        </>
    );
};

export default StatisticsPage;