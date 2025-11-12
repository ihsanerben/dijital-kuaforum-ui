import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Typography,
  Button,
  Table,
  message,
  Space,
  Popconfirm,
  Modal,
  Form,
  Input,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { logout } from "../api/authService";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerService";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;

const CustomerCRUDPage = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null); // Düzenlenen müşteri (null ise ekleme)
  const [form] = Form.useForm(); // Ant Design Form yönetimi için

  // Müşterileri Backend'den Çekme Fonksiyonu
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      message.error(
        "Müşteri listesi çekilirken hata oluştu. Lütfen girişinizi kontrol edin."
      );
      console.error("Fetch Customer Error:", error);
      if (error.response && error.response.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleLogout = () => {
    logout();
    message.success("Başarıyla çıkış yapıldı.");
    navigate("/login");
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, values);
        message.success("Müşteri başarıyla güncellendi.");
      } else {
        await createCustomer(values);
        message.success("Yeni müşteri başarıyla eklendi.");
      }
      setIsModalVisible(false);
      fetchCustomers();
      form.resetFields();
    } catch (error) {
      let errorMessage = "İşlem sırasında beklenmeyen bir hata oluştu.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      message.success("Müşteri başarıyla silindi.");
      fetchCustomers();
    } catch (error) {
      message.error("Müşteri silinirken hata oluştu.");
      console.error("Delete Customer Error:", error);
    }
  };

  const showModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
    form.setFieldsValue(customer || { name: "", phone: "", email: "" });
  };

  const columns = [
    // NOT: dataIndex alanları, Spring Boot'taki Customer modelinizle birebir aynı olmalıdır.
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tam Adı", dataIndex: "fullName", key: "fullName" },
    { title: "Telefon", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "İşlemler",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Düzenle
          </Button>
          <Popconfirm
            title="Bu müşteriyi silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button danger icon={<DeleteOutlined />}>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          padding: "0 24px",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Müşteri Yönetim Paneli
        </Title>
        <Space>
          <Button
            type="primary"
            onClick={() => showModal(null)}
            icon={<PlusOutlined />}
          >
            Yeni Müşteri Ekle
          </Button>
          <Button danger onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: "24px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <Title level={5}>Müşteri Listesi</Title>

          {/* Müşteri Listesi Tablosu */}
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Content>

      {/* Ekleme/Güncelleme Modal'ı */}
      <Modal
        title={editingCustomer ? "Müşteri Düzenle" : "Yeni Müşteri Ekle"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          // Düzenleme sırasında initialValues, showModal içinde set ediliyor.
        >
          <Form.Item
            name="fullName"
            label="Ad Soyad"
            rules={[
              { required: true, message: "Lütfen müşterinin adını giriniz!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Telefon Numarası"
            rules={[
              { required: true, message: "Lütfen telefon numarasını giriniz!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-posta"
            rules={[
              { type: "email", message: "Geçerli bir e-posta adresi giriniz!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginTop: 20 }}>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
            >
              İptal
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingCustomer ? "Güncelle" : "Kaydet"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CustomerCRUDPage;
