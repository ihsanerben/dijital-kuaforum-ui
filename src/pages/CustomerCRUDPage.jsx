// src/pages/CustomerCRUDPage.jsx - FİNAL VE EKSİKSİZ KOD

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, message, Popconfirm, Modal, Form, Input, Row, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customerService";
import { useNavigate } from "react-router-dom";
// DashboardLayout importu kaldırılmıştır, rota yapısı gereği artık dışarıdan sarılmaktadır.

const { Title } = Typography;

const CustomerCRUDPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); 
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
      // Düzenleme modunda, telefon numarasını +90'sız göster
      const rawPhoneNumber = customer.phoneNumber.startsWith('+90') 
        ? customer.phoneNumber.substring(3) 
        : customer.phoneNumber;
        
      form.setFieldsValue({
        ...customer,
        phoneNumber: rawPhoneNumber
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Form Gönderimi (Ekleme/Düzenleme)
  const onFinish = async (values) => {
    setLoading(true);
    
    // Telefon numarasının başına +90 ekliyoruz
    const fullPhoneNumber = "+90" + values.phoneNumber; 
    
    const dataToSend = {
        ...values,
        phoneNumber: fullPhoneNumber,
        // E-posta formdan kaldırıldı ancak values'ta olmayacağı için sorun yok.
    };

    try {
      if (editingCustomer) {
        // Düzenleme
        await updateCustomer(editingCustomer.id, dataToSend);
        message.success("Müşteri başarıyla güncellendi.");
      } else {
        // Ekleme
        await createCustomer(dataToSend);
        message.success("Müşteri başarıyla eklendi.");
      }
      setIsModalVisible(false);
      fetchCustomers();
    } catch (error) {
      message.error(`İşlem başarısız: ${error.response?.data || 'Sunucu hatası'}`);
    } finally {
        setLoading(false);
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
          <Form.Item 
             name="fullName" 
             label="Tam Adı" 
             rules={[{ required: true, message: 'Lütfen müşterinin adını girin.' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item 
             name="phoneNumber" 
             label="Telefon Numarası (0 olmadan 10 hane)" 
             rules={[
                { required: true, message: 'Lütfen telefon numarasını girin.' },
                { len: 10, message: 'Telefon numarası 10 hane olmalıdır.' }
             ]}
          >
            <Input 
                addonBefore="+90" // SABİT ÖN EK
                placeholder="5321234567" 
                maxLength={10} // 10 haneyi zorunlu kıl
            />
          </Form.Item>
          
          {/* E-POSTA ALANI KALDIRILDI */}
          
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