// src/components/QuickAppointmentModal.jsx - ANT DESIGN UYUMLU FİNAL KODU

import React, { useState, useEffect, useCallback } from 'react';
// Ant Design Importları
import { Modal, Button, Form, Alert, Select, DatePicker, TimePicker, Input, Spin, message, Space, Typography } from 'antd'; 
import { LoadingOutlined, SearchOutlined, ClockCircleOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
// API Importları
import { searchCustomers } from '../api/customerService'; 
import { getAllHizmetlerAdmin } from '../api/hizmetService'; 
import { getAvailableSlotsAdmin, createAppointmentAdmin } from '../api/appointmentService';

const { Option } = Select;
const { Text, Title } = Typography;
const { Search } = Input;

// Müşteri seçimi, hizmet seçimi ve hızlı onaylı randevu oluşturmayı yönetir.
const QuickAppointmentModal = ({ isVisible, onClose, onAppointmentCreated }) => {
    const [form] = Form.useForm();
    
    // 1. Randevu Bilgisi State'leri
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // 2. Kontrol State'leri
    const [loading, setLoading] = useState(false); // Ana randevu oluşturma yükleniyor
    const [slotLoading, setSlotLoading] = useState(false); // Slotlar yükleniyor
    const [fetchingCustomers, setFetchingCustomers] = useState(false);
    const [error, setError] = useState('');

    // --- Veri Çekme İşlevleri ---

    const fetchServices = useCallback(async () => {
        try {
            const response = await getAllHizmetlerAdmin();
            setAllServices(response.data);
        } catch (err) {
            setError('Hizmetler yüklenirken bir hata oluştu.');
        }
    }, []);

    // Uygun saat dilimlerini çek (Hizmet veya Tarih değiştiğinde tetiklenir)
    const fetchAvailableSlots = useCallback(async () => {
        if (!selectedServiceId || !selectedDate) {
            setAvailableSlots([]);
            setSelectedSlot(null);
            return;
        }

        setSlotLoading(true);
        setError('');
        try {
            const dateString = selectedDate.format('YYYY-MM-DD');
            const response = await getAvailableSlotsAdmin(selectedServiceId, dateString);
            setAvailableSlots(response.data || []);
            setSelectedSlot(null);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Uygun randevu saatleri çekilirken hata oluştu.');
            setAvailableSlots([]);
        } finally {
            setSlotLoading(false);
        }
    }, [selectedServiceId, selectedDate]);

    // Hizmetleri ve slotları yüklemek için useEffect'ler
    useEffect(() => { fetchServices(); }, [fetchServices]);
    useEffect(() => { fetchAvailableSlots(); }, [fetchAvailableSlots]);
    
    // Müşteri Arama İşlemi (Select bileşeni için)
    const handleCustomerSearch = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setFetchingCustomers(true);
        try {
            const response = await searchCustomers(query);
            // Customer objesi alınıyor
            setSearchResults(response.data || []); 
        } catch (err) {
            setError('Müşteri arama hatası.');
            setSearchResults([]);
        } finally {
            setFetchingCustomers(false);
        }
    };

    // Müşteri Select bileşeni değiştiğinde
    const handleCustomerSelect = (value) => {
        // value, customerId'dir. searchResults'tan customer objesini bul
        const customer = searchResults.find(c => c.id === value);
        setSelectedCustomer(customer);
        setSearchResults([]);
    };
    
    // --- Randevu Oluşturma İşlemi ---
    const handleCreateAppointment = async (values) => {
        if (!selectedCustomer || !selectedServiceId || !selectedSlot) {
             // Bu kontrol Form.Item rules'da olduğu için gerek kalmayabilir.
            setError('Lütfen tüm gerekli alanları doldurun.');
            return;
        }

        setLoading(true);
        setError('');

        const fullDateTime = moment(values.randevuTarihi)
            .hour(moment(values.randevuSaati).hour())
            .minute(moment(values.randevuSaati).minute())
            .second(0);
        
        const startDateTime = fullDateTime.format('YYYY-MM-DDTHH:mm:ss');

        const appointmentData = {
            customerId: selectedCustomer.id,
            serviceId: selectedServiceId,
            startDateTime: startDateTime,
        };

        try {
            await createAppointmentAdmin(appointmentData);
            onAppointmentCreated(`Randevu, ${selectedCustomer.fullName} için başarıyla oluşturuldu ve ONAYLANDI.`);
            handleReset();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // --- Modal Yönetimi ---
    const handleReset = () => {
        form.resetFields();
        setSearchResults([]);
        setSelectedCustomer(null);
        setSelectedServiceId(null);
        setSelectedDate(moment());
        setAvailableSlots([]);
        setSelectedSlot(null);
        setError('');
        setLoading(false);
        setSlotLoading(false);
    };

    const handleModalClose = () => {
        handleReset();
        onClose();
    };

    // --- UI Render ---
    return (
        <Modal 
            title={<Title level={4} style={{ margin: 0 }}>Hızlı Randevu Oluşturma</Title>}
            open={isVisible} 
            onCancel={handleModalClose} 
            centered
            footer={[
                <Button key="back" onClick={handleModalClose} disabled={loading}>
                    İptal
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={loading} 
                    onClick={() => form.submit()} // Formu tetikle
                    disabled={loading}
                >
                    Randevu Oluştur & Onayla
                </Button>,
            ]}
        >
            <Form 
                form={form} 
                layout="vertical" 
                name="admin_booking_form"
                onFinish={handleCreateAppointment} // Form submit olduğunda asıl fonksiyonu çağır
            >
                {/* Hata Mesajı */}
                {error && <Alert message="Hata" description={error} type="error" showIcon closable onClose={() => setError('')} />}
                
                {/* 1. MÜŞTERİ SEÇİMİ */}
                <Form.Item
                    name="musteriId"
                    label="Müşteri Seçimi"
                    rules={[{ required: true, message: 'Lütfen bir müşteri seçin!' }]}
                    // Seçilen müşteriyi formu resetlemeden önce göster
                    initialValue={selectedCustomer ? `${selectedCustomer.fullName} - ${selectedCustomer.phoneNumber}` : null}
                >
                    <Select
                        showSearch
                        placeholder="Müşteri Adı veya Telefon No ile Ara..."
                        filterOption={false}
                        onSearch={handleCustomerSearch}
                        onChange={handleCustomerSelect}
                        value={selectedCustomer ? selectedCustomer.id : null}
                        notFoundContent={fetchingCustomers ? <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} /> : 'Müşteri bulunamadı'}
                        disabled={selectedCustomer !== null} 
                        style={{ width: '100%' }}
                    >
                        {searchResults.map(c => (
                            <Option key={c.id} value={c.id}>
                                {`${c.fullName} - ${c.phoneNumber}`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* 2. HİZMET SEÇİMİ */}
                <Form.Item
                    name="serviceId"
                    label="Hizmet Seçimi"
                    rules={[{ required: true, message: 'Lütfen bir hizmet seçin!' }]}
                >
                    <Select
                        placeholder="Alınacak hizmeti seçin"
                        onChange={(value) => setSelectedServiceId(value)}
                        disabled={allServices.length === 0}
                    >
                        {allServices.map(h => (
                            <Option key={h.id} value={h.id}>
                                {`${h.ad} (${h.sureDakika} dk)`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                
                {/* 3. TARİH VE SAAT SEÇİMİ */}
                <Form.Item label="Randevu Tarihi ve Saati" required>
                    <Space.Compact style={{ width: '100%' }}>
                        <Form.Item
                            name="randevuTarihi"
                            rules={[{ required: true, message: 'Tarih gerekli!' }]}
                            style={{ width: '50%', marginBottom: 0 }}
                        >
                            <DatePicker 
                                placeholder="Tarih Seçin" 
                                style={{ width: '100%' }}
                                disabledDate={current => current && current < moment().startOf('day')}
                                onChange={(date) => setSelectedDate(date)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="randevuSaati"
                            rules={[{ required: true, message: 'Saat gerekli!' }]}
                            style={{ width: '50%', marginBottom: 0 }}
                        >
                            <Select
                                placeholder={slotLoading ? "Yükleniyor..." : "Saat seçiniz"}
                                onChange={(value) => setSelectedSlot(value)}
                                disabled={availableSlots.length === 0 || !selectedServiceId}
                                loading={slotLoading}
                                value={selectedSlot}
                            >
                                {availableSlots.map((slot) => (
                                    <Option key={slot} value={slot}>
                                        {slot}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Space.Compact>
                     {/* Uygun Saat Bulunamadı Uyarısı */}
                     {selectedServiceId && availableSlots.length === 0 && !slotLoading && (
                        <Text type="danger" style={{ marginTop: 5, display: 'block' }}>
                            Seçilen hizmet/tarih için uygun saat bulunamadı.
                        </Text>
                    )}
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default QuickAppointmentModal;