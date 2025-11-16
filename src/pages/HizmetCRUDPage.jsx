// src/pages/HizmetCRUDPage.jsx - BASİTLEŞTİRİLMİŞ INPUT TİPLERİ

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Space, Input, App,Spin, Popconfirm, Form, Modal, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import { getAllHizmetler, createHizmet, updateHizmet, deleteHizmet } from '../api/hizmetService'; 
import { getAdminAuthData } from '../utils/storage'; 

const { Title } = Typography;
const { Search } = Input;
const DURATION_STEP = 10; // 10 dakikanın katı olmalı

const HizmetCRUDPage = () => {
    const { message } = App.useApp();
    const [hizmetler, setHizmetler] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingHizmet, setEditingHizmet] = useState(null); 
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState(''); 
    
    const adminAuth = getAdminAuthData();
    const headers = { Username: adminAuth.username, Password: adminAuth.password };

    const fetchHizmetler = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllHizmetler(); 
            // Veriyi çekmeden önce Number() cast işlemi yapmıyoruz, string olarak geliyor
            const sortedData = (response.data || []).sort((a, b) => b.id - a.id);
            setHizmetler(sortedData);
        } catch (error) {
            message.error('Hizmet listesi yüklenemedi. Yetki veya sunucu hatası.');
            console.error('Hizmet Çekme Hatası:', error);
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchHizmetler();
    }, [fetchHizmetler]);

    // Form açma/kapama
    const handleEdit = (hizmet) => {
        setEditingHizmet(hizmet);
        if (hizmet) {
            // Sadece değerleri form alanlarına atıyoruz. Tip dönüşümünü input'tan kaldırdık.
            form.setFieldsValue(hizmet);
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    // Form gönderimi (Ekleme/Düzenleme)
    const onFinish = async (values) => {
        // 10'un katı kontrolü
        if (values.sureDakika % DURATION_STEP !== 0) {
            message.error(`Hizmet süresi (${DURATION_STEP} dakikanın) katı olmalıdır!`);
            return;
        }

        try {
            if (editingHizmet) {
                // Güncelleme işlemi
                await updateHizmet(editingHizmet.id, values, headers);
                message.success('Hizmet başarıyla güncellendi.');
            } else {
                // Ekleme işlemi
                await createHizmet(values, headers);
                message.success('Yeni hizmet başarıyla eklendi.');
            }
            setModalVisible(false);
            fetchHizmetler();
        } catch (error) {
            message.error(`İşlem başarısız: ${error.response?.data?.message || 'Sunucu hatası'}`);
        }
    };
    
    // ... (handleDelete ve handleSearchChange aynı kalır)

    const handleDelete = async (id) => {
        try {
            await deleteHizmet(id, headers);
            message.success('Hizmet başarıyla silindi.');
            fetchHizmetler();
        } catch (error) {
            message.error(`Silme başarısız: ${error.response?.data?.message || 'Sunucu hatası'}`);
        }
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredHizmetler = hizmetler.filter(hizmet => {
        if (!searchText) return true;
        const searchTarget = `${hizmet.ad || ''} ${hizmet.sureDakika || ''} ${hizmet.fiyat || ''}`.toLowerCase();
        return searchTarget.includes(searchText);
    });

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 50, sorter: (a, b) => a.id - b.id, defaultSortOrder: 'descend' },
        { title: 'Hizmet Adı', dataIndex: 'ad', key: 'ad', sorter: (a, b) => (a.ad || '').localeCompare(b.ad || '', 'tr', { sensitivity: 'base' }) },
        { title: 'Süre (dk)', dataIndex: 'sureDakika', key: 'sureDakika', sorter: (a, b) => a.sureDakika - b.sureDakika, render: text => `${text} dk` },
        { title: 'Fiyat', dataIndex: 'fiyat', key: 'fiyat', sorter: (a, b) => a.fiyat - b.fiyat, render: text => `${text} TL` },
        {
            title: 'İşlemler',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Düzenle</Button>
                    <Popconfirm title="Emin misiniz?" onConfirm={() => handleDelete(record.id)} okText="Evet" cancelText="Hayır">
                        <Button icon={<DeleteOutlined />} size="small" danger>Sil</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Title level={2}>Hizmet Yönetim Paneli</Title>
            
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Search
                        placeholder="Hizmet adına göre ara"
                        allowClear
                        onChange={handleSearchChange} 
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => handleEdit(null)}
                    >
                        Yeni Hizmet Ekle
                    </Button>
                </Col>
            </Row>

            <Spin spinning={loading}>
                <Table 
                    columns={columns} 
                    dataSource={filteredHizmetler} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Spin>

            {/* Hizmet Ekleme/Düzenleme Modalı */}
            <Modal
                title={editingHizmet ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={editingHizmet}>
                    <Form.Item name="ad" label="Hizmet Adı" rules={[{ required: true, message: 'Lütfen hizmet adını girin.' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="sureDakika" label={`Süre (${DURATION_STEP}'un katı olmalı)`} rules={[{ required: true, message: 'Lütfen hizmet süresini dakika olarak girin.' }]}>
                        {/* DÜZELTME: Basit Input'a çevrildi */}
                        <Input /> 
                    </Form.Item>
                    <Form.Item name="fiyat" label="Fiyat (TL)" rules={[{ required: true, message: 'Lütfen fiyatı girin.' }]}>
                        {/* DÜZELTME: Basit Input'a çevrildi */}
                        <Input /> 
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>{editingHizmet ? "Kaydet ve Güncelle" : "Ekle"}</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default HizmetCRUDPage;