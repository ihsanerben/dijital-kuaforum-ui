// src/pages/AdminCalendarPage.jsx - FINAL CODE (WORKING ADMIN PANEL)

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Spin, Space, message, Input, Row, Col, App } from 'antd'; 
import moment from 'moment';
import 'moment/locale/tr';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllAppointmentsAdmin, updateAppointmentStatus } from '../api/appointmentService';
import QuickAppointmentModal from '../components/QuickAppointmentModal'; 

const { Title, Text } = Typography;
const { Search } = Input;
moment.locale('tr'); 

// Defines the priority order for status sorting (BEKLEMEDE should come first)
const STATUS_ORDER = { 'BEKLEMEDE': 1, 'ONAYLANDI': 2, 'REDDEDİLDİ': 3 };

const AdminCalendarPage = () => {
    // messageApi kullanımı
    const { message: messageApi, contextHolder } = App.useApp();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    
    // Modal visibility state
    const [isModalVisible, setIsModalVisible] = useState(false);

    // --- DATA FETCHING ---
    // src/pages/AdminCalendarPage.jsx (fetchAppointments function)

const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
        const response = await getAllAppointmentsAdmin();
        // 🚨 CRITICAL FIX: Check if the response data is a valid array
        if (Array.isArray(response.data)) {
            // Sort data by startTime (descending: newest first)
            const sortedData = response.data.sort((a, b) => 
                moment(b.startTime).valueOf() - moment(a.startTime).valueOf()
            );
            setAppointments(sortedData);
        } else {
            // If the response is an object (like an ErrorDTO), treat it as an empty list
            setAppointments([]); 
        }
        
    } catch (error) {
        // Log the error details to the console
        console.error('Admin Appointment Fetch Error:', error);
        
        // Check for specific error status codes (e.g., 401, 500)
        const status = error.response?.status;
        let errorMessage = 'Randevu listesi yüklenemedi. Yetki veya sunucu hatası.';

        if (status === 401) {
             errorMessage = 'Oturum süresi doldu. Lütfen tekrar giriş yapın.';
        } else if (status === 500) {
             errorMessage = 'Sunucu İç Hatası (500). Veri tabanı ilişkilerini kontrol edin.';
        }

        messageApi.error(errorMessage);
        setAppointments([]); // Clear list on failure
        
    } finally {
        setLoading(false);
    }
}, [messageApi]);

    useEffect(() => { 
        fetchAppointments(); 
    }, [fetchAppointments]);

    // --- HANDLERS ---
    
    // Live Search
    const handleSearchChange = (e) => { setSearchText(e.target.value.toLowerCase()); };

    // Approve / Reject
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
    
    // UI Helpers
    const getStatusColor = (status) => { return status === 'ONAYLANDI' ? 'green' : status === 'BEKLEMEDE' ? 'orange' : 'red'; };
    
    // Filtering Logic
    const filteredAppointments = appointments.filter(appointment => {
        if (!searchText) return true;
        
        // Search targets: Customer Name, Email, Status, Date/Time
        const searchTarget = [
            appointment.customer?.fullName || '',
            appointment.customer?.email || '', 
            appointment.totalPrice ? appointment.totalPrice.toString() : '',
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
            // Default sort: Newest first
            sorter: (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf(), defaultSortOrder: 'descend',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {/* Date and Day */}
                    <Text strong style={{ fontSize: '14px' }}>{moment(record.startTime).format('DD/MM/YYYY dddd')}</Text>
                    {/* Time Range */}
                    <Text type="secondary" style={{ fontSize: '13px' }}>{moment(record.startTime).format('HH:mm')} - {moment(record.endTime).format('HH:mm')}</Text>
                    {/* Service Details - Assuming RandevuHizmetleri is EAGER fetched */}
                    <Text style={{ fontSize: '13px', color: '#1890ff', fontWeight: 500 }}>
                        {record.randevuHizmetleri 
                            ? record.randevuHizmetleri.map(rh => rh.hizmet?.ad).filter(name => name).join(', ') 
                            : 'Yükleniyor...'}
                    </Text>
                </Space>
            ),
        },
        { 
            title: 'Durum', dataIndex: 'status', key: 'status', width: 150,
            // Custom sort: PENDING (1) > APPROVED (2)
            sorter: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
            render: text => <Text strong style={{ color: getStatusColor(text) }}>{text}</Text> 
        },
        { 
            title: 'İşlemler', key: 'action', width: 150,
            render: (_, record) => (
                <Space size="middle">
                    {/* Onayla / Reddet Buttons */}
                    {record.status === 'BEKLEMEDE' && <>
                        <Button icon={<CheckCircleOutlined />} type="primary" size="small" onClick={() => handleStatusUpdate(record.id, 'ONAYLANDI')}>Onayla</Button>
                        <Button icon={<CloseCircleOutlined />} type="danger" size="small" onClick={() => handleStatusUpdate(record.id, 'REDDEDİLDİ')}>Reddet</Button>
                    </>}
                    {/* İşlem Tamamlandı */}
                    {(record.status === 'ONAYLANDI' || record.status === 'REDDEDİLDİ') && <Text type="secondary">İşlem Tamamlandı</Text>}
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
                        onClick={() => setIsModalVisible(true)} 
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
                onClose={() => setIsModalVisible(false)}
                onAppointmentCreated={fetchAppointments} 
            />
        </>
    );
};

export default AdminCalendarPage;