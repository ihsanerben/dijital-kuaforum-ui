import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, message, Spin, Space } from 'antd';
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '../components/DashboardLayout'; // Admin Layout'unuz
import { getAllAppointmentsAdmin, updateAppointmentStatus } from '../api/appointmentService';
import { isAdminLoggedIn } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminCalendarPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Yetkilendirme kontrolü (Admin giriş yapmadıysa yönlendir)
    if (!isAdminLoggedIn()) {
        navigate('/adminGiris', { replace: true });
        return null;
    }

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllAppointmentsAdmin();
            // Backend'den gelen veriyi işleyelim
            setAppointments(response.data || []);
        } catch (error) {
            message.error('Randevu listesi yüklenemedi. Yetki veya sunucu hatası.');
            console.error('Admin Randevu Çekme Hatası:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Randevu Durumu Güncelleme İşlemi (Onayla/Reddet)
    const handleStatusUpdate = async (id, newStatus) => {
        setLoading(true);
        try {
            await updateAppointmentStatus(id, newStatus);
            message.success(`Randevu başarıyla ${newStatus === 'ONAYLANDI' ? 'onaylandı' : 'reddedildi'}.`);
            // Listeyi yeniden çek
            fetchAppointments(); 
        } catch (error) {
            console.log(error);
            message.error('Durum güncellenemedi. Sunucu hatası.');
        } finally {
            setLoading(false);
        }
    };
    
    // Tablo Sütunları
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
        { 
            title: 'Müşteri', 
            dataIndex: ['customer', 'fullName'], 
            key: 'customerName',
            render: (text, record) => record.customer ? record.customer.fullName : 'HATA', // İlişkiyi göster
        },
        { 
            title: 'Saat Aralığı', 
            key: 'timeRange', 
            render: (_, record) => (
                `${moment(record.startTime).format('DD/MM HH:mm')} - ${moment(record.endTime).format('HH:mm')}`
            )
        },
        // Not: Hizmet detayları (ne iş yapılacağı) için ayrı bir sorgu gerekebilir.
        // Şimdilik sadece toplam fiyatı gösterelim:
        { title: 'Fiyat', dataIndex: 'totalPrice', key: 'price', render: (text) => `${text} TL` },
        { 
            title: 'Durum', 
            dataIndex: 'status', 
            key: 'status',
            render: (text) => (
                <Text strong style={{ color: text === 'ONAYLANDI' ? 'green' : text === 'BEKLEMEDE' ? 'orange' : 'red' }}>
                    {text}
                </Text>
            )
        },
        {
            title: 'İşlemler',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status === 'BEKLEMEDE' && (
                        <>
                            <Button 
                                icon={<CheckCircleOutlined />} 
                                type="primary" 
                                size="small"
                                onClick={() => handleStatusUpdate(record.id, 'ONAYLANDI')}
                            >
                                Onayla
                            </Button>
                            <Button 
                                icon={<CloseCircleOutlined />} 
                                type="danger" 
                                size="small"
                                onClick={() => handleStatusUpdate(record.id, 'REDDEDİLDİ')}
                            >
                                Reddet
                            </Button>
                        </>
                    )}
                     {(record.status === 'ONAYLANDI' || record.status === 'REDDEDİLDİ') && (
                        <Text type="secondary">İşlem Tamamlandı</Text>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <Title level={2}>Randevu Yönetimi Paneli</Title>
            <Text>Bekleyen, onaylanmış ve reddedilmiş tüm randevuları buradan yönetebilirsiniz.</Text>
            
            <Spin spinning={loading}>
                <Table 
                    columns={columns} 
                    dataSource={appointments} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    style={{ marginTop: 20 }}
                />
            </Spin>
        </DashboardLayout>
    );
};

export default AdminCalendarPage;