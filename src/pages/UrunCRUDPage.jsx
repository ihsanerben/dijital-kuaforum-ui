// src/pages/UrunCRUDPage.jsx - TAM ÇÖZÜLMÜŞ FINAL KOD

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Space, Modal, Form, Input, InputNumber, App, Row, Col, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { getUrunler, createUrun, updateUrun, deleteUrun } from '../api/urunService'; 

const { Title } = Typography;
const { Search } = Input;

const UrunCRUDPage = () => {
    const { notification, modal, message } = App.useApp(); 
    const [form] = Form.useForm();
    
    const [urunler, setUrunler] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUrun, setEditingUrun] = useState(null); 
    const [searchText, setSearchText] = useState(''); 

    // --- VERİ ÇEKME VE TİP DÖNÜŞÜMÜ ---
    const fetchUrunler = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getUrunler();
            setUrunler(response);
            
        } catch (error) {
            notification.error({
                message: 'Hata',
                description: 'Ürünler yüklenirken bir hata oluştu.',
            });
            console.error('Ürün Çekme Hatası:', error);
        } finally {
            setLoading(false);
        }
    }, [notification]);

    useEffect(() => {
        fetchUrunler();
    }, [fetchUrunler]);

    // --- MODAL & CRUD ---
    const showAddModal = () => {
        setEditingUrun(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingUrun(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => setIsModalVisible(false);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            const dataToSend = { 
                ...values,
                fiyat: values.fiyat?.toFixed(2) || "0.00"
            };

            if (editingUrun) {
                await updateUrun(Number(editingUrun.id), dataToSend);
                message.success("Ürün güncellendi.");
            } else {
                await createUrun(dataToSend);
                message.success("Yeni ürün eklendi.");
            }

            setIsModalVisible(false);
            fetchUrunler();
        } catch (error) {
            const msg = error.response?.data?.message || "Bir hata oluştu.";
            notification.error({
                message: "İşlem Hatası",
                description: msg,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id, ad) => {
        modal.confirm({
            title: `${ad} adlı ürünü silmek istediğinizden emin misiniz?`,
            content: "Bu işlem geri alınamaz.",
            okText: 'Evet, Sil',
            okType: 'danger',
            cancelText: 'Vazgeç',
            onOk: async () => {
                setLoading(true);
                try {
                    await deleteUrun(Number(id));
                    message.success(`${ad} silindi.`);
                    fetchUrunler();
                } catch (error) {
                    notification.error({
                        message: 'Hata',
                        description: `${ad} silinirken bir hata oluştu.`,
                    });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    // --- ARAMA ---
    const handleSearchChange = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredUrunler = urunler.filter(urun => {
        if (!searchText) return true;
        const target = `${urun.ad} ${urun.tedarikci} ${urun.fiyat} ${urun.stokAdedi}`.toLowerCase();
        return target.includes(searchText);
    });

    // --- TABLO KOLONLARI ---
    const columns = [
        {
            title: 'Ürün Adı',
            dataIndex: 'ad',
            key: 'ad',
            sorter: (a, b) => (a.ad || '').localeCompare(b.ad || '', 'tr'),
        },
        {
            title: 'Fiyat',
            dataIndex: 'fiyat',
            key: 'fiyat',
            render: (v) => `${Number(v).toFixed(2)} TL`,
            sorter: (a, b) => a.fiyat - b.fiyat,
        },
        {
            title: 'Stok Adedi',
            dataIndex: 'stokAdedi',
            key: 'stokAdedi',
            sorter: (a, b) => a.stokAdedi - b.stokAdedi,
        },
        {
            title: 'Tedarikçi',
            dataIndex: 'tedarikci',
            key: 'tedarikci',
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small">Düzenle</Button>
                    <Popconfirm 
                        title="Emin misiniz?" 
                        onConfirm={() => handleDelete(record.id, record.ad)} 
                        okText="Evet" 
                        cancelText="Hayır"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small">Sil</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Title level={2}><ShoppingOutlined /> Ürün ve Stok Yönetimi</Title>
            
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Search
                        placeholder="Ara: ürün adı, fiyat, tedarikçi..."
                        allowClear
                        onChange={handleSearchChange}
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                        Yeni Ürün Ekle
                    </Button>
                </Col>
            </Row>

            <Table 
                columns={columns} 
                dataSource={filteredUrunler}
                loading={loading}
                rowKey="key"                  // 🔥 en stabil olan hali
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingUrun ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="ad" label="Ürün Adı" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="stokAdedi" label="Stok Adedi" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="fiyat" label="Fiyat (TL)" rules={[{ required: true }]}>
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="tedarikci" label="Tedarikçi">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {editingUrun ? "Kaydet" : "Ekle"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UrunCRUDPage;
