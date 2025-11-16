// src/pages/AdminCalendarPage.jsx - FİNAL KOD

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Spin, Space, message, Input, Row } from 'antd';
import moment from 'moment';
import 'moment/locale/tr';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllAppointmentsAdmin, updateAppointmentStatus } from '../api/appointmentService';

const { Title, Text } = Typography;
const { Search } = Input;
moment.locale('tr'); 

const AdminCalendarPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState(''); 

    // Statülerin öncelik sırası: Beklemede en üstte olmalı
    const STATUS_ORDER = {
        'BEKLEMEDE': 1,
        'ONAYLANDI': 2,
        'REDDEDİLDİ': 3,
        // Diğer durumlar 4
    };

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllAppointmentsAdmin();
            // Veriyi başlangıç zamanına göre AZALAN (descending) sırada sırala (Yeniden Eskiye)
            const sortedData = (response.data || []).sort((a, b) => 
                moment(b.startTime).valueOf() - moment(a.startTime).valueOf()
            );
            setAppointments(sortedData);
        } catch (error) {
            messageApi.error('Randevu listesi yüklenemedi. Yetki veya sunucu hatası.');
            console.error('Admin Randevu Çekme Hatası:', error);
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => { 
        fetchAppointments(); 
    }, [fetchAppointments]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

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
    
    const getStatusColor = (status) => {
        return status === 'ONAYLANDI' ? 'green' : status === 'BEKLEMEDE' ? 'orange' : 'red';
    };
    
    const filteredAppointments = appointments.filter(appointment => {
        if (!searchText) return true;
        
        // Arama hedefleri: Müşteri Adı, Email, Fiyat, Statü ve Tarih/Saat
        const searchTarget = [
            appointment.customer?.fullName || '',
            appointment.customer?.email || '', // Email aramaya eklendi
            appointment.totalPrice ? appointment.totalPrice.toString() : '',
            appointment.status || '',
            moment(appointment.startTime).format('DD/MM/YYYY dddd HH:mm') || ''
        ].join(' ').toLowerCase();
        
        return searchTarget.includes(searchText);
    });

    const columns = [
        { 
            title: 'ID', 
            dataIndex: 'id', 
            key: 'id', 
            width: 50,
            sorter: (a, b) => a.id - b.id, 
        },
        { 
            title: 'Müşteri', 
            dataIndex: ['customer', 'fullName'], 
            key: 'customerName',
            width: 120,
            sorter: (a, b) => (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '', 'tr', { sensitivity: 'base' }),
            render: (text, record) => record.customer?.fullName || 'Tanımlanamadı'
        },
        { 
            title: 'Email', 
            dataIndex: ['customer', 'email'], 
            key: 'customerEmail',
            width: 150,
            // Email'e göre sıralama eklendi
            sorter: (a, b) => (a.customer?.email || '').localeCompare(b.customer?.email || '', 'tr', { sensitivity: 'base' }),
        },
        { 
            title: 'Saat Aralığı', 
            key: 'timeRange', 
            width: 250,
            // Tarihe göre sıralama
            sorter: (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf(),
            defaultSortOrder: 'descend', // Varsayılan: Yeniden Eskiye
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: '14px' }}>
                        {moment(record.startTime).format('DD/MM/YYYY dddd')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                        {moment(record.startTime).format('HH:mm')} - {moment(record.endTime).format('HH:mm')}
                    </Text>
                </Space>
            ),
        },
        { 
            title: 'Durum', 
            dataIndex: 'status', 
            key: 'status', 
            width: 150,
            // 👈 DURUMA GÖRE SIRALAMA: Öncelik (BEKLEMEDE: 1, ONAYLANDI: 2, REDDEDİLDİ: 3)
            sorter: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
            render: text => <Text strong style={{ color: getStatusColor(text) }}>{text}</Text> 
        },
    ];

    return (
        <>
            {contextHolder}
            <Title style={{margin: 0}} level={1}>Randevu Yönetimi Paneli</Title>
             
            
            <Row justify="end" style={{ marginBottom: 20 }}>
                <Search

                    placeholder="Müşteri adına, e-postaya veya duruma göre ara"
                    allowClear
                    onChange={handleSearchChange} 
                    style={{ width: 420 }}
                />
            </Row>

            <Spin spinning={loading}>
                <Table 
                    columns={columns} 
                    dataSource={filteredAppointments} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }} 
                />
            </Spin>
        </>
    );
};

export default AdminCalendarPage;