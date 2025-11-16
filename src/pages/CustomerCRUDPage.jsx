// src/pages/CustomerCRUDPage.jsx - FİNAL VE EKSİKSİZ KOD

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Typography, Input, App, Popconfirm, Row } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import { getCustomers, deleteCustomer } from '../api/customerService'; 
import CustomerFormModal from '../components/CustomerFormModal'; // Form bileşeni import edildi

const { Title } = Typography;
const { Search } = Input;

const CustomerCRUDPage = () => {
    // 👈 Ant Design message servisine güvenli erişim
    const { message } = App.useApp(); 
    
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null); 
    const [searchText, setSearchText] = useState(''); 

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCustomers();
            const sortedData = (response.data || []).sort((a, b) => b.id - a.id);
            setCustomers(sortedData);
        } catch (error) {
            message.error('Müşteri listesi yüklenemedi. Yetki/sunucu hatası.');
            console.error('Müşteri Çekme Hatası:', error);
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            message.success('Müşteri başarıyla silindi.');
            fetchCustomers();
        } catch (error) {
            message.error('Müşteri silinirken hata oluştu.');
        }
    };

    const filteredCustomers = customers.filter(customer => {
        if (!searchText) return true;
        const searchTarget = `${customer.fullName || ''} ${customer.phoneNumber || ''} ${customer.email || ''}`.toLowerCase();
        return searchTarget.includes(searchText);
    });

    const handleModalClose = () => {
        setModalVisible(false);
        setEditingCustomer(null);
    };

    const handleModalOpen = (customer) => {
        setEditingCustomer(customer);
        setModalVisible(true);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter: (a, b) => a.id - b.id, defaultSortOrder: 'descend' },
        { title: 'Tam Adı', dataIndex: 'fullName', key: 'fullName', sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || '', 'tr', { sensitivity: 'base' }) },
        { title: 'Telefon', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'İşlemler',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleModalOpen(record)}>
                        Düzenle
                    </Button>
                    <Popconfirm
                        title="Emin misiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>
                            Sil
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        // Layout temizlendi, sadece içeriği döndürüyoruz
        <>
            <Title style={{margin: 0}} level={1}>Müşteri Yönetim Paneli</Title>
            
            <Row justify="end" style={{ marginBottom: 20 }}>
                <Space>
                    <Search
                        placeholder="İsme, telefona veya e-postaya göre ara"
                        allowClear
                        onChange={handleSearchChange}
                        style={{ width: 420, marginRight: 10 }}
                    />
                    <Button 
                        type="primary" 
                        icon={<UserAddOutlined />}
                        onClick={() => handleModalOpen(null)}
                        style={{ height: 40, width: 220 }}
                    >
                        Yeni Müşteri Ekle
                    </Button>
                </Space>
            </Row>

            <Table 
                columns={columns} 
                dataSource={filteredCustomers} 
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            
            <CustomerFormModal
                visible={modalVisible}
                onClose={handleModalClose}
                onSubmit={fetchCustomers} 
                customer={editingCustomer}
            />
        </>
    );
};

export default CustomerCRUDPage;