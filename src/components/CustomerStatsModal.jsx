// src/components/CustomerStatsModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Spin, Alert, Statistic, Row, Col, Tag } from 'antd';
import { UserOutlined, DollarOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getCustomerStats } from '../api/appointmentService';

const CustomerStatsModal = ({ visible, onClose, customerId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible && customerId) {
            fetchStats();
        } else {
            setStats(null); // Modal kapandığında temizle
        }
    }, [visible, customerId]);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCustomerStats(customerId);
            setStats(response.data);
        } catch (err) {
            setError('İstatistikler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Müşteri Analizi ve İstatistikleri"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
            ) : error ? (
                <Alert message="Hata" description={error} type="error" />
            ) : stats ? (
                <div>
                    <div style={{ marginBottom: 20, padding: 15, background: '#f0f2f5', borderRadius: 8 }}>
                        <h3 style={{ margin: 0 }}><UserOutlined /> {stats.fullName}</h3>
                    </div>

                    <Row gutter={16} style={{ marginBottom: 20 }}>
                        <Col span={12}>
                            <Statistic 
                                title="Toplam Harcama" 
                                value={stats.totalSpent} 
                                prefix={<DollarOutlined />} 
                                suffix="TL" 
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic 
                                title="Toplam Ziyaret" 
                                value={stats.totalAppointments} 
                                prefix={<CalendarOutlined />} 
                            />
                        </Col>
                    </Row>

                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Son Ziyaret Tarihi">
                            {stats.lastVisitDate ? moment(stats.lastVisitDate).format('DD MMMM YYYY HH:mm') : <Tag color="orange">Henüz Yok</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Favori Hizmeti">
                            {stats.favoriteService !== '-' ? <Tag color="blue"><StarOutlined /> {stats.favoriteService}</Tag> : '-'}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ) : null}
        </Modal>
    );
};

export default CustomerStatsModal;