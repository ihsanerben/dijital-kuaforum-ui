// src/components/CustomerFormModal.jsx - FİNAL KOD

import React from 'react';
// App eklendi
import { Modal, Form, Input, Button, Space, Typography, App } from 'antd'; 
import { createCustomer, updateCustomer } from '../api/customerService'; 

const { Text } = Typography;

const CustomerFormModal = ({ visible, onClose, onSubmit, customer }) => {
    const [form] = Form.useForm();
    const isEditing = !!customer;
    const { message } = App.useApp(); 

    React.useEffect(() => {
        if (customer) {
            const rawPhoneNumber = customer.phoneNumber.startsWith('+90') 
                ? customer.phoneNumber.substring(3) 
                : customer.phoneNumber;

            form.setFieldsValue({
                ...customer,
                phoneNumber: rawPhoneNumber,
            });
        } else {
            form.resetFields();
        }
    }, [customer, form]);

    const handleFormSubmit = async (values) => {
        const fullPhoneNumber = "+90" + values.phoneNumber;
        const dataToSend = { ...values, phoneNumber: fullPhoneNumber };
        
        try {
            if (isEditing) {
                await updateCustomer(customer.id, dataToSend);
                message.success('Müşteri başarıyla güncellendi.');
            } else {
                await createCustomer(dataToSend);
                message.success('Yeni müşteri başarıyla eklendi.');
            }
            
            onSubmit(); 
            onClose();  
            
        } catch (error) {
            message.error(`İşlem başarısız: ${error.response?.data?.message || 'Sunucu hatası'}`);
        }
    };

    return (
        <Modal
        style={{height: 520, width: 520 }}
            title={isEditing ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                
                <Form.Item 
                    name="fullName" 
                    label="Tam Adı" 
                    rules={[{ required: true, message: 'Lütfen müşterinin tam adını girin.' }]}
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
                        addonBefore="+90" 
                        placeholder="5321234567" 
                        maxLength={10}
                    />
                </Form.Item>
                
                <Form.Item 
                    name="email" 
                    label={
                        <Text>
                            Email Adresi 
                            <Text type="secondary" style={{ marginLeft: 5 }}>
                                (Zorunlu değil)
                            </Text>
                        </Text>
                    }
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Space>
                        <Button onClick={onClose} style={{ width: 120 }}>
                            İptal
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            style={{ width: 220 }}
                        >
                            {isEditing ? 'Kaydet ve Güncelle' : 'Ekle'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CustomerFormModal;