// src/pages/CustomerCRUDPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Table,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Row,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerService";

const { Title } = Typography;

const CustomerCRUDPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();

  // Ant Design mesaj API
  const [messageApi, contextHolder] = message.useMessage();

  // Müşteri listesi çekme
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCustomers();
      if (Array.isArray(response.data)) setCustomers(response.data);
      else setCustomers([]);
    } catch (error) {
      console.error(error);
      messageApi.error("Müşteri listesi çekilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Modal açma
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    if (customer) {
      const rawPhoneNumber = customer.phoneNumber.startsWith("+90")
        ? customer.phoneNumber.substring(3)
        : customer.phoneNumber;

      form.setFieldsValue({ ...customer, phoneNumber: rawPhoneNumber });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Form gönderimi
  const onFinish = async (values) => {
    setLoading(true);
    const fullPhoneNumber = "+90" + values.phoneNumber;
    const dataToSend = { ...values, phoneNumber: fullPhoneNumber };

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, dataToSend);
        messageApi.success("Müşteri başarıyla güncellendi.");
      } else {
        await createCustomer(dataToSend);
        messageApi.success("Müşteri başarıyla eklendi.");
      }
      setIsModalVisible(false);
      fetchCustomers();
    } catch (error) {
      console.error(error);
      messageApi.error("Bu telefon numarasına kayıtlı bir müşteri zaten mevcut.");
    } finally {
      setLoading(false);
    }
  };

  // Müşteri silme
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteCustomer(id);
      messageApi.success("Müşteri başarıyla silindi.");
      fetchCustomers();
    } catch (error) {
      console.error(error);
      messageApi.warning("Silme işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    { title: "Tam Adı", dataIndex: "fullName", key: "fullName" },
    { title: "Telefon", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "İşlemler",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
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
      {contextHolder} {/* <-- Ant Design mesajları için */}
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
            rules={[{ required: true, message: "Lütfen müşterinin adını girin." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Telefon Numarası (0 olmadan 10 hane)"
            rules={[
              { required: true, message: "Lütfen telefon numarasını girin." },
              { len: 10, message: "Telefon numarası 10 hane olmalıdır." },
            ]}
          >
            <Input addonBefore="+90" placeholder="5321234567" maxLength={10} />
          </Form.Item>

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
