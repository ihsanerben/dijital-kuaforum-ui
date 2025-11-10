import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Typography, Button, Table, message, Space, Popconfirm, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { logout } from '../api/authService';
// customerService.js içindeki yetkilendirme mantığına güvenerek sadece fonksiyonları çağırıyoruz.
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customerService';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const CustomerCRUDPage = () => {
    const navigate = useNavigate();
    
    // State'ler
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
            // Hata genellikle yetkilendirme (401) veya bağlantı sorunu (network)
            message.error('Müşteri listesi çekilirken hata oluştu. Lütfen girişinizi kontrol edin.');
            console.error("Fetch Customer Error:", error);
            // 401 hatası varsa, kullanıcıyı logine yönlendirmek iyi bir uygulamadır.
            if (error.response && error.response.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Sayfa Yüklendiğinde Müşterileri Çek
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Çıkış Yapma İşlemi
    const handleLogout = () => {
        logout(); // storage'dan bilgiyi temizler
        message.success('Başarıyla çıkış yapıldı.');
        navigate('/login'); // Login sayfasına yönlendir
    };

    // Müşteri Silme İşlemi
    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            message.success('Müşteri başarıyla silindi.');
            fetchCustomers(); // Listeyi yenile
        } catch (error) {
            message.error('Müşteri silinirken hata oluştu.');
            console.error("Delete Customer Error:", error);
        }
    };
    
    // Modal Açma/Düzenleme İşlemi
    const showModal = (customer = null) => {
        setEditingCustomer(customer);
        setIsModalVisible(true);
        // Eğer müşteri varsa, formu o verilerle doldur
        form.setFieldsValue(customer || { name: '', phone: '', email: '' }); 
    };

    // Form Submit İşlemi (Ekleme veya Güncelleme)
    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (editingCustomer) {
                // Güncelleme işlemi
                await updateCustomer(editingCustomer.id, values);
                message.success('Müşteri başarıyla güncellendi.');
            } else {
                // Ekleme işlemi
                await createCustomer(values);
                message.success('Yeni müşteri başarıyla eklendi.');
            }
            setIsModalVisible(false); // Modalı kapat
            fetchCustomers(); // Listeyi yenile
            form.resetFields(); // Formu temizle

        } catch (error) {
            let errorMessage = 'İşlem sırasında beklenmeyen bir hata oluştu.';
            if (error.response && error.response.data && error.response.data.message) {
                 // Backend'den gelen özel hata mesajını göster
                 errorMessage = error.response.data.message; 
            } else if (error.message) {
                 errorMessage = error.message;
            }
            message.error(errorMessage);
            
        } finally {
            setLoading(false);
        }
    };
    
    // Ant Design Table kolon tanımlamaları
    const columns = [
        // NOT: dataIndex alanları, Spring Boot'taki Customer modelinizle birebir aynı olmalıdır.
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 }, 
        { title: 'Tam Adı', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Telefon', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Email', dataIndex: 'email', key: 'email' }, 
        {
            title: 'İşlemler',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => showModal(record)}
                    >
                        Düzenle
                    </Button>
                    <Popconfirm
                        title="Bu müşteriyi silmek istediğinizden emin misiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Evet"
                        cancelText="Hayır"
                    >
                        <Button danger icon={<DeleteOutlined />}>Sil</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0 24px' }}>
                <Title level={4} style={{ margin: 0 }}>Müşteri Yönetim Paneli</Title>
                <Space>
                    <Button type="primary" onClick={() => showModal(null)} icon={<PlusOutlined />}>
                        Yeni Müşteri Ekle
                    </Button>
                    <Button danger onClick={handleLogout}>
                        Çıkış Yap
                    </Button>
                </Space>
            </Header>
            <Content style={{ padding: '24px' }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
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
                onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
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
                        rules={[{ required: true, message: 'Lütfen müşterinin adını giriniz!' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        name="phoneNumber"
                        label="Telefon Numarası"
                        rules={[{ required: true, message: 'Lütfen telefon numarasını giriniz!' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        name="email"
                        label="E-posta"
                        rules={[{ type: 'email', message: 'Geçerli bir e-posta adresi giriniz!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button style={{ marginRight: 8 }} onClick={() => { setIsModalVisible(false); form.resetFields(); }}>
                            İptal
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingCustomer ? 'Güncelle' : 'Kaydet'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default CustomerCRUDPage;