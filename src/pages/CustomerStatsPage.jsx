// src/components/QuickAppointmentModal.jsx - ANT DESIGN FİNAL KODU

import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Alert, Select, DatePicker, TimePicker, Input, Spin, message, Space, Typography } from 'antd';
import { SearchOutlined, UserOutlined, ClockCircleOutlined, CalendarOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
// API Importları
import { searchCustomers } from '../api/customerService'; 
import { getAllHizmetlerAdmin } from '../api/hizmetService'; 
import { getAvailableSlotsAdmin, createAppointmentAdmin } from '../api/appointmentService';

const { Option } = Select;
const { Text } = Typography;

// Müşteri seçimi, hizmet seçimi ve hızlı onaylı randevu oluşturmayı yönetir.
const QuickAppointmentModal = ({ isVisible, onClose, onAppointmentCreated }) => {
    const [form] = Form.useForm();
    
    // Randevu Bilgisi State'leri
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [allServices, setAllServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const [selectedDate, setSelectedDate] = useState(moment());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Kontrol State'leri
    const [loading, setLoading] = useState(false); // Ana randevu oluşturma yükleniyor
    const [slotLoading, setSlotLoading] = useState(false); // Slotlar yükleniyor
    const [fetchingCustomers, setFetchingCustomers] = useState(false);
    const [error, setError] = useState('');

    // --- Veri Çekme İşlevleri ---

    // Hizmetleri yükle
    const fetchServices = useCallback(async () => {
        try {
            const response = await getAllHizmetlerAdmin();
            setAllServices(response.data);
        } catch (err) {
            setError('Hizmetler yüklenirken bir hata oluştu Statistics.');
        }
    }, []);

    // Uygun saat dilimlerini çek
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
            setAvailableSlots(response.data);
            setSelectedSlot(null);
        } catch (err) {
            setError('Uygun randevu saatleri çekilirken hata oluştu.');
            setAvailableSlots([]);
        } finally {
            setSlotLoading(false);
        }
    }, [selectedServiceId, selectedDate]);

    // Bileşen yüklendiğinde hizmetleri çek
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Hizmet veya tarih değiştiğinde uygun slotları çek
    useEffect(() => {
        fetchAvailableSlots();
    }, [fetchAvailableSlots]);
    
    // Müşteri Arama İşlemi (Select bileşeni için)
    const handleCustomerSearch = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setFetchingCustomers(true);
        try {
            const response = await searchCustomers(query);
            // Customer objesinin yapısını varsayarak sonuçları set et
            setSearchResults(response.data || []); 
        } catch (err) {
            setError('Müşteri arama hatası Statistics.');
            setSearchResults([]);
        } finally {
            setFetchingCustomers(false);
        }
    };

    // Müşteri Select bileşeni değiştiğinde
    const handleCustomerSelect = (value, option) => {
        // Option'dan customer objesini al (biz burada key'e ID'yi atıyoruz, bu yüzden basit tutalım)
        const customer = searchResults.find(c => c.id === value);
        setSelectedCustomer(customer);
        setSearchQuery(''); // Arama metnini temizle
        setSearchResults([]);
    };
    
    // --- Randevu Oluşturma İşlemi ---
    const handleCreateAppointment = () => {
        if (!selectedCustomer || !selectedServiceId || !selectedSlot) {
            setError('Lütfen tüm gerekli alanları doldurun.');
            return;
        }

        // Formu resetlemek için gerekli olan form.validateFields() yapısını kullanmıyoruz, 
        // direkt state'den değer alıyoruz.

        setLoading(true);
        setError('');

        const startDateTime = moment(`${selectedDate.format('YYYY-MM-DD')}T${selectedSlot}`).format('YYYY-MM-DDTHH:mm:ss');
        
        const appointmentData = {
            customerId: selectedCustomer.id,
            serviceId: selectedServiceId,
            startDateTime: startDateTime,
            // Backend, serviceId'den süreyi hesaplayıp onaylı randevuyu kaydeder.
        };

        createAppointmentAdmin(appointmentData)
        .then(() => {
            onAppointmentCreated(`Randevu, ${selectedCustomer.fullName} için başarıyla oluşturuldu ve ONAYLANDI.`);
            handleReset();
            onClose();
        })
        .catch((err) => {
            setError(err.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu.');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    // --- Modal Yönetimi ---
    const handleReset = () => {
        // Form alanlarını sıfırla
        form.resetFields(); 
        setSearchQuery('');
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
            title="Admin Hızlı Randevu Oluştur"
            open={isVisible}
            onCancel={handleModalClose}
            footer={[
                <Button key="back" onClick={handleModalClose} disabled={loading}>
                    İptal
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={loading} 
                    onClick={handleCreateAppointment}
                    disabled={!selectedCustomer || !selectedServiceId || !selectedSlot || loading}
                >
                    Randevu Oluştur & Onayla
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" name="admin_booking_form">
                {error && <Alert message="Hata" description={error} type="error" showIcon />}
                
                {/* 1. MÜŞTERİ SEÇİMİ */}
                <Form.Item
                    name="musteriSearch"
                    label="Müşteri Seçimi"
                    rules={[{ required: true, message: 'Lütfen bir müşteri seçin!' }]}
                    // Müşteri seçiliyse alanı doldur
                    initialValue={selectedCustomer ? `${selectedCustomer.fullName} - ${selectedCustomer.phoneNumber}` : searchQuery}
                    onClick={() => { if(selectedCustomer) setSelectedCustomer(null)}} // Seçiliyken tıklanınca sıfırla
                >
                    <Select
                        showSearch
                        placeholder="Müşteri Adı veya Telefon No ile Ara..."
                        filterOption={false}
                        onSearch={handleCustomerSearch}
                        onChange={handleCustomerSelect}
                        value={selectedCustomer ? selectedCustomer.id : null}
                        notFoundContent={fetchingCustomers ? <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} /> : 'Müşteri bulunamadı'}
                        disabled={selectedCustomer !== null} // Müşteri seçiliyse disable et
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
                                placeholder={slotLoading ? "Saatler yükleniyor..." : "Saat seçiniz"}
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