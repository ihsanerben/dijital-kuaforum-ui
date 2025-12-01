// src/pages/CustomerCRUDPage.jsx (Mevcut dosyanızı bununla güncelleyin)

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Typography, Input, App, Popconfirm, Row } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined, BarChartOutlined } from '@ant-design/icons'; // BarChartOutlined eklendi
import { getCustomers, deleteCustomer } from '../api/customerService'; 
import CustomerFormModal from '../components/CustomerFormModal';
import CustomerStatsModal from '../components/CustomerStatsModal'; // 👈 Modal Import Edildi

const { Title } = Typography;
const { Search } = Input;

const CustomerCRUDPage = () => {
    const { message } = App.useApp();
    
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form Modalı State'leri
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null); 
    
    // İstatistik Modalı State'leri
    const [statsModalVisible, setStatsModalVisible] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const [searchText, setSearchText] = useState(''); 

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCustomers();
            const sortedData = (response.data || []).sort((a, b) => b.id - a.id);
            setCustomers(sortedData);
        } catch (error) {
            message.error('Müşteri listesi yüklenemedi.');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

    const handleSearchChange = (e) => { setSearchText(e.target.value.toLowerCase()); };

    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            message.success('Müşteri silindi.');
            fetchCustomers();
        } catch (error) {
            message.error('Silme hatası.');
        }
    };

    const handleStatsOpen = (id) => {
        setSelectedCustomerId(id);
        setStatsModalVisible(true);
    };

    const filteredCustomers = customers.filter(customer => {
        if (!searchText) return true;
        const searchTarget = `${customer.fullName || ''} ${customer.phoneNumber || ''}`.toLowerCase();
        return searchTarget.includes(searchText);
    });

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 50 },
        { title: 'Tam Adı', dataIndex: 'fullName' },
        { title: 'Telefon', dataIndex: 'phoneNumber' },
        {
            title: 'İşlemler',
            key: 'actions',
            width: 250,
            render: (_, record) => (
                <Space size="small">
                    {/* İSTATİSTİK BUTONU */}
                    <Button 
                        icon={<BarChartOutlined />} 
                        size="small" 
                        onClick={() => handleStatsOpen(record.id)}
                    >
                        İstatistik
                    </Button>

                    <Button icon={<EditOutlined />} size="small" onClick={() => { setEditingCustomer(record); setModalVisible(true); }}>
                        Düzenle
                    </Button>
                    
                    <Popconfirm title="Sil?" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} size="small" danger>Sil</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Title level={2}>Müşteri Yönetim Paneli</Title>
            <Row justify="end" style={{ marginBottom: 20 }}>
                <Space>
                    <Search placeholder="Ara..." onChange={handleSearchChange} style={{ width: 300 }} />
                    <Button type="primary" icon={<UserAddOutlined />} onClick={() => { setEditingCustomer(null); setModalVisible(true); }}>
                        Yeni Müşteri
                    </Button>
                </Space>
            </Row>

            <Table columns={columns} dataSource={filteredCustomers} rowKey="id" loading={loading} />
            
            {/* Ekleme/Düzenleme Modalı */}
            <CustomerFormModal 
                visible={modalVisible} 
                onClose={() => setModalVisible(false)} 
                onSubmit={fetchCustomers} 
                customer={editingCustomer} 
            />

            {/* İstatistik Modalı */}
            <CustomerStatsModal
                visible={statsModalVisible}
                onClose={() => setStatsModalVisible(false)}
                customerId={selectedCustomerId}
            />
        </>
    );
};

export default CustomerCRUDPage;