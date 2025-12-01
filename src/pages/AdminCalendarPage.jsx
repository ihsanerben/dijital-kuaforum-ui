// src/pages/AdminCalendarPage.jsx - FİNAL KOD

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Spin, Space, message, Input, Row, Col, App, Popconfirm } from 'antd'; 
import moment from 'moment';
import 'moment/locale/tr';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { getAllAppointmentsAdmin, updateAppointmentStatus } from '../api/appointmentService';
import QuickAppointmentModal from '../components/QuickAppointmentModal'; 

const { Title, Text } = Typography;
const { Search } = Input;
moment.locale('tr'); 

const STATUS_ORDER = { 'BEKLEMEDE': 1, 'ONAYLANDI': 2, 'REDDEDİLDİ': 3, 'CANCELLED': 4 };

const AdminCalendarPage = () => {
    // messageApi kullanımı
    const { message: messageApi, contextHolder } = App.useApp();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    
    const [isModalVisible, setIsModalVisible] = useState(false);

    // --- DATA FETCHING ---
    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllAppointmentsAdmin();
            
            // Veriyi başlangıç zamanına göre AZALAN (descending) sırada sırala (Yeniden Eskiye)
            const sortedData = (response.data || []).sort((a, b) => 
                moment(b.startTime).valueOf() - moment(a.startTime).valueOf()
            );
            
            // 🚨 CRITICAL FIX: Array.isArray kontrolü (Önceki hatadan dolayı eklendi)
            if (Array.isArray(response.data)) {
                setAppointments(sortedData);
            } else {
                 setAppointments([]);
            }
        } catch (error) {
            messageApi.error('Randevu listesi yüklenemedi. Yetki veya sunucu hatası.');
            console.error('Admin Randevu Fetch Error:', error);
            setAppointments([]); // Hata durumunda listeyi temizle
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => { 
        fetchAppointments(); 
    }, [fetchAppointments]);

    // --- HANDLERS ---
    
    const handleSearchChange = (e) => { setSearchText(e.target.value.toLowerCase()); };

    const handleStatusUpdate = async (id, newStatus) => {
        setLoading(true);
        try {
            await updateAppointmentStatus(id, newStatus);
            
            let messageText;
            if (newStatus === 'ONAYLANDI') messageText = 'onaylandı';
            else if (newStatus === 'REDDEDİLDİ') messageText = 'reddedildi';
            else if (newStatus === 'CANCELLED') messageText = 'iptal edildi'; 
            
            messageApi.success(`Randevu başarıyla ${messageText}.`);
            fetchAppointments(); 
        } catch (error) {
            messageApi.error('Durum güncellenemedi. Sunucu hatası.');
        } finally {
            setLoading(false);
        }
    };

    // Yeni Randevu İçin Modalı Aç
    const handleNewAppointmentOpen = () => {
        setIsModalVisible(true);
    };

    // UI Helpers
    const getStatusColor = (status) => { 
        if (status === 'ONAYLANDI') return 'green';
        if (status === 'BEKLEMEDE') return 'orange';
        return 'red'; 
    };
    
    // Filtering Logic
    const filteredAppointments = appointments.filter(appointment => {
        if (!searchText) return true;
        
        const searchTarget = [
            appointment.customer?.fullName || '',
            appointment.customer?.email || '', 
            appointment.status || '',
            moment(appointment.startTime).format('DD/MM/YYYY dddd HH:mm') || ''
        ].join(' ').toLowerCase();
        
        return searchTarget.includes(searchText);
    });

    // --- COLUMN DEFINITION ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 50, sorter: (a, b) => a.id - b.id, },
        { title: 'Müşteri', dataIndex: ['customer', 'fullName'], key: 'customerName', width: 120, sorter: (a, b) => (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '', 'tr', { sensitivity: 'base' }), render: (text, record) => record.customer?.fullName || 'Tanımlanamadı' },
        { title: 'Email', dataIndex: ['customer', 'email'], key: 'customerEmail', width: 150, sorter: (a, b) => (a.customer?.email || '').localeCompare(b.customer?.email || '', 'tr', { sensitivity: 'base' })},
        { 
            title: 'Saat Aralığı', 
            key: 'timeRange', 
            width: 250,
            sorter: (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf(), defaultSortOrder: 'descend',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {/* Tarih ve Gün Adı */}
                    <Text strong style={{ fontSize: '14px' }}>{moment(record.startTime).format('DD/MM/YYYY dddd')}</Text>
                    {/* Time Range */}
                    <Text type="secondary" style={{ fontSize: '13px' }}>{moment(record.startTime).format('HH:mm')} - {moment(record.endTime).format('HH:mm')}</Text>
                    {/* Service Details - (randevuHizmetleri ilişkisinin var olduğu varsayılır) */}
                    <Text style={{ fontSize: '13px', color: '#1890ff', fontWeight: 500 }}>
                        {record.randevuHizmetleri 
                            ? record.randevuHizmetleri.map(rh => rh.hizmet?.ad).filter(name => name).join(', ') 
                            : 'Hizmet bilgisi yok'}
                    </Text>
                </Space>
            ),
        },
        { 
            title: 'Durum', dataIndex: 'status', key: 'status', width: 150,
            sorter: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
            render: text => <Text strong style={{ color: getStatusColor(text) }}>{text}</Text> 
        },
        { 
            title: 'İşlemler', key: 'action', width: 150,
            render: (_, record) => (
                <Space size="middle">
                    
                    {/* ONAY / REDDET (Sadece BEKLEMEDE için) */}
                    {record.status === 'BEKLEMEDE' && <>
                        <Button icon={<CheckCircleOutlined />} type="primary" size="small" onClick={() => handleStatusUpdate(record.id, 'ONAYLANDI')}>Onayla</Button>
                        <Button icon={<CloseCircleOutlined />} type="danger" size="small" onClick={() => handleStatusUpdate(record.id, 'REDDEDİLDİ')}>Reddet</Button>
                    </>}
                    
                    {/* İPTAL ET (Sadece ONAYLANMIŞ Randevular için) */}
                    {record.status === 'ONAYLANDI' && (
                        <Popconfirm
                            title="Randevu iptal edilecek, mail gönderilecek. Emin misiniz?"
                            onConfirm={() => handleStatusUpdate(record.id, 'CANCELLED')} 
                            okText="Evet, İptal Et"
                            cancelText="Hayır"
                        >
                            <Button icon={<CloseCircleOutlined />} size="small" danger>İptal Et</Button>
                        </Popconfirm>
                    )}

                    {/* İşlem Tamamlandı Mesajı */}
                    {(record.status === 'REDDEDİLDİ' || record.status === 'CANCELLED') && <Text type="secondary">İşlem Tamamlandı</Text>}
                </Space>
            )
        }
    ];

    return (
        <>
            {contextHolder}
            <Title level={2}>Randevu Yönetimi Paneli</Title>
            
            <Row justify="space-between" align="middle" style={{ marginTop: 20, marginBottom: 20 }}>
                {/* SOL: Yeni Randevu Butonu */}
                <Col>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={handleNewAppointmentOpen} 
                    >
                        Yeni Randevu Oluştur
                    </Button>
                </Col>
                {/* SAĞ: Arama Kutusu */}
                <Col>
                    <Search
                        placeholder="Müşteri adına, e-postaya veya duruma göre ara"
                        allowClear
                        onChange={handleSearchChange} 
                        style={{ width: 300 }}
                    />
                </Col>
            </Row>

            <Spin spinning={loading}>
                <Table 
                    columns={columns} 
                    dataSource={filteredAppointments} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }} 
                />
            </Spin>
            
            <QuickAppointmentModal
                isVisible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                }}
                onAppointmentCreated={fetchAppointments} 
                appointmentToEdit={null} // Düzenleme kaldırıldığı için her zaman null gönderilir
            />
        </>
    );
};

export default AdminCalendarPage;