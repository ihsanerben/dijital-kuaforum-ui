// src/pages/CustomerCRUDPage.jsx - TEMİZLENMİŞ HAL

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, message, Popconfirm, Modal, Form, Input, Row, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// DashboardLayout importu SİLİNDİ
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customerService";
import { useNavigate } from "react-router-dom";

const { Title, Content } = Typography; // Content artık Typography'den geliyor

const CustomerCRUDPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // Düzenlenen müşteri (null = ekleme)
  const [form] = Form.useForm();

  // Müşterileri Backend'den Çekme Fonksiyonu
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCustomers();
      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Müşteri listesi çekilirken hata oluştu:", error);
      message.error("Müşteri listesi çekilirken hata oluştu. Lütfen girişi kontrol edin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Yeni/Düzenleme Modal'ını Açma
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    if (customer) {
      form.setFieldsValue(customer);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Form Gönderimi (Ekleme/Düzenleme)
  const onFinish = async (values) => {
    try {
      if (editingCustomer) {
        // Düzenleme
        await updateCustomer(editingCustomer.id, values);
        message.success("Müşteri başarıyla güncellendi.");
      } else {
        // Ekleme
        // Not: Backend'iniz DTO beklediği için bu kısım DTO yapısına göre düzenlenmelidir.
        // Bu basitlik için DTO'yu serviste sarmaladığımızı varsayıyoruz.
        await createCustomer(values);
        message.success("Müşteri başarıyla eklendi.");
      }
      setIsModalVisible(false);
      fetchCustomers();
    } catch (error) {
      message.error(`İşlem başarısız: ${error.response?.data || 'Sunucu hatası'}`);
    }
  };

  // Müşteri Silme
  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      message.success("Müşteri başarıyla silindi.");
      fetchCustomers();
    } catch (error) {
      message.error(`Silme başarısız: ${error.response?.data || 'Sunucu hatası'}`);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Tam Adı', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Telefon', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
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
    // DashboardLayout'suz sadece içeriği döndürüyoruz
    <>
      <Title level={2}>Müşteri Yönetim Paneli</Title>
      
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => handleEdit(null)}
        >
          Yeni Müşteri Ekle
        </Button>
      </Row>

      <Table 
        dataSource={customers} 
        columns={columns} 
        loading={loading} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCustomer ? "Müşteri Düzenle" : "Yeni Müşteri Ekle"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="fullName" label="Tam Adı" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Telefon Numarası" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email Adresi" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          {/* Admin kaydında şifre vermiyoruz. Müşteri register olurken ekler. */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingCustomer ? "Kaydet ve Güncelle" : "Ekle"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerCRUDPage;