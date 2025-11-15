import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Spin, Space, message } from 'antd';
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getAllAppointmentsAdmin, updateAppointmentStatus } from '../api/appointmentService';
const { Title, Text } = Typography;

const AdminCalendarPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllAppointmentsAdmin();
            setAppointments(response.data || []);
        } catch (error) {
            messageApi.error('Randevu listesi yüklenemedi. Yetki veya sunucu hatası.');
            console.error('Admin Randevu Çekme Hatası:', error);
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const handleStatusUpdate = async (id, newStatus) => {
        setLoading(true);
        try {
            await updateAppointmentStatus(id, newStatus);
            messageApi.success(`Randevu başarıyla ${newStatus === 'ONAYLANDI' ? 'onaylandı' : 'reddedildi'}.`);
            fetchAppointments();
        } catch (error) {
            messageApi.error('Durum güncellenemedi. Sunucu hatası.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
        { title: 'Müşteri', dataIndex: ['customer', 'fullName'], key: 'customerName', render: (text, record) => record.customer?.fullName || 'Tanımlanamadı' },
        { title: 'Saat Aralığı', key: 'timeRange', render: (_, record) => `${moment(record.startTime).format('DD/MM HH:mm')} - ${moment(record.endTime).format('HH:mm')}` },
        { title: 'Fiyat', dataIndex: 'totalPrice', key: 'price', render: text => `${text} TL` },
        { title: 'Durum', dataIndex: 'status', key: 'status', render: text => <Text strong style={{ color: text === 'ONAYLANDI' ? 'green' : text === 'BEKLEMEDE' ? 'orange' : 'red' }}>{text}</Text> },
        { 
            title: 'İşlemler', key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'BEKLEMEDE' && <>
                        <Button icon={<CheckCircleOutlined />} type="primary" size="small" onClick={() => handleStatusUpdate(record.id, 'ONAYLANDI')}>Onayla</Button>
                        <Button icon={<CloseCircleOutlined />} type="danger" size="small" onClick={() => handleStatusUpdate(record.id, 'REDDEDİLDİ')}>Reddet</Button>
                    </>}
                    {(record.status === 'ONAYLANDI' || record.status === 'REDDEDİLDİ') && <Text type="secondary">İşlem Tamamlandı</Text>}
                </Space>
            )
        }
    ];

    return (
        <>
            {contextHolder}
            <Title level={2}>Randevu Yönetimi Paneli</Title>
            <Text>Bekleyen, onaylanmış ve reddedilmiş tüm randevuları buradan yönetebilirsiniz.</Text>
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={appointments} rowKey="id" pagination={{ pageSize: 10 }} style={{ marginTop: 20 }} />
            </Spin>
        </>
    );
};

export default AdminCalendarPage;
