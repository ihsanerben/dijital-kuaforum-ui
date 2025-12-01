// src/components/QuickAppointmentModal.jsx - FİNAL VE HATASIZ KOD

import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Select,
  DatePicker,
  Spin,
  Space,
  Typography,
  App,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
// DÜZELTME: Ant Design v5 ile uyumluluk için Moment yerine Dayjs kullanıyoruz
import dayjs from "dayjs"; 

// API Importları
import { searchCustomers } from "../api/customerService";
import { getAllHizmetlerAdmin } from "../api/hizmetService";
import {
  getAvailableSlotsAdmin,
  createAppointmentAdmin,
} from "../api/appointmentService";

const { Option } = Select;
const { Title, Text } = Typography;

const QuickAppointmentModal = ({
  isVisible,
  onClose,
  onAppointmentCreated,
  appointmentToEdit
}) => {
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const isEditing = !!appointmentToEdit;

  // 1. Randevu Bilgisi State'leri
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]); 
  // DÜZELTME: Başlangıç değeri dayjs()
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // 2. Kontrol State'leri
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [fetchingCustomers, setFetchingCustomers] = useState(false);
  const [error, setError] = useState("");

  // Hesaplanan toplam süreyi göster
  const totalDuration = allServices
    .filter((h) => selectedServiceIds.includes(h.id))
    .reduce((sum, h) => sum + h.sureDakika, 0);

  // --- Veri Çekme İşlevleri ---

  const fetchServices = useCallback(async () => {
    try {
      const response = await getAllHizmetlerAdmin();
      setAllServices(response.data);
    } catch (err) {
      setError("Hizmetler yüklenirken bir hata oluştu.");
    }
  }, []);

  // Uygun saat dilimlerini çek
  const fetchAvailableSlots = useCallback(async () => {
    if (totalDuration === 0 || !selectedDate) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      form.setFieldsValue({ randevuSaati: null });
      return;
    }

    setSlotLoading(true);
    setError("");
    try {
      const dateString = selectedDate.format("YYYY-MM-DD");
      const serviceIdForCheck = selectedServiceIds.length > 0 ? selectedServiceIds[0] : null;

      const response = await getAvailableSlotsAdmin(
        serviceIdForCheck,
        dateString
      );
      setAvailableSlots(response.data || []);
      
      const currentSlot = form.getFieldValue('randevuSaati');
      if (currentSlot && response.data && !response.data.includes(currentSlot)) {
           setSelectedSlot(null);
           form.setFieldsValue({ randevuSaati: null });
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Uygun randevu saatleri çekilirken hata oluştu."
      );
      setAvailableSlots([]);
    } finally {
      setSlotLoading(false);
    }
  }, [selectedServiceIds, selectedDate, totalDuration, form]);

  // useEffects
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);
  
  // Düzenleme modunda formu doldur
  useEffect(() => {
      if (isVisible && appointmentToEdit) {
          // DÜZELTME: Gelen tarihi dayjs objesine çeviriyoruz
          const startTime = dayjs(appointmentToEdit.startTime);
          
          const serviceIds = appointmentToEdit.randevuHizmetleri?.map(rh => rh.hizmet?.id) || [];
          
          form.setFieldsValue({
              musteriId: appointmentToEdit.customer.id,
              randevuTarihi: startTime,
              randevuSaati: startTime.format('HH:mm'),
              serviceIds: serviceIds,
          });
          
          setSelectedCustomer(appointmentToEdit.customer);
          setSelectedServiceIds(serviceIds);
          setSelectedDate(startTime);
          setSelectedSlot(startTime.format('HH:mm'));
          
      } else if (isVisible && !appointmentToEdit) {
          handleReset();
      }
  }, [isVisible, appointmentToEdit, form]);


  // Müşteri Arama
  const handleCustomerSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setFetchingCustomers(true);
    try {
      const response = await searchCustomers(query);
      setSearchResults(response.data || []);
    } catch (err) {
      setError("Müşteri arama hatası.");
      setSearchResults([]);
    } finally {
      setFetchingCustomers(false);
    }
  };

  const handleCustomerSelect = (value) => {
    const customer = searchResults.find((c) => c.id === value);
    setSelectedCustomer(customer);
    form.setFieldsValue({ musteriId: value });
    setSearchResults([]);
  };

  // --- Randevu Oluşturma / Düzenleme ---
  const handleCreateAppointment = async (values) => {
    if (!selectedCustomer || selectedServiceIds.length === 0 || !values.randevuSaati) {
      setError("Lütfen tüm gerekli alanları doldurun.");
      return;
    }

    setLoading(true);
    setError("");

    // Tarih ve Saati Birleştir - DÜZELTME: dayjs kullanımı
    let fullDateTime = dayjs(values.randevuTarihi);
    
    if (values.randevuSaati) {
        // String "HH:mm" gelirse parse et
        const [hour, minute] = values.randevuSaati.split(':');
        
        fullDateTime = fullDateTime
            .hour(parseInt(hour))
            .minute(parseInt(minute))
            .second(0);
    }

    const startDateTime = fullDateTime.format("YYYY-MM-DDTHH:mm:ss");

    const appointmentData = {
      customerId: selectedCustomer.id,
      hizmetIdleri: values.serviceIds,
      startTime: startDateTime,
    };

    try {
      await createAppointmentAdmin(appointmentData);
      
      messageApi.success(
        `Randevu, ${selectedCustomer.fullName} için başarıyla ${isEditing ? 'güncellendi' : 'oluşturuldu'} ve ONAYLANDI.`
      );
      if (onAppointmentCreated) onAppointmentCreated();
      handleModalClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "İşlem sırasında bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults([]);
    setSelectedCustomer(null);
    setSelectedServiceIds([]);
    setSelectedDate(dayjs()); // Reset to now
    setAvailableSlots([]);
    setSelectedSlot(null);
    setError("");
    setLoading(false);
    setSlotLoading(false);
  };

  const handleModalClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          {isEditing ? "Randevu Düzenle" : "Hızlı Randevu Oluşturma"}
        </Title>
      }
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
          onClick={() => form.submit()}
          disabled={
            !selectedCustomer ||
            selectedServiceIds.length === 0 ||
            !form.getFieldValue('randevuSaati') ||
            loading
          }
        >
          {isEditing ? "Kaydet" : `Oluştur (${totalDuration} dk)`}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="admin_booking_form"
        onFinish={handleCreateAppointment}
        initialValues={{ randevuTarihi: dayjs() }} // Initial value updated
      >
        {error && (
          <Alert
            message="Hata"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 1. MÜŞTERİ SEÇİMİ */}
        <Form.Item
          name="musteriId"
          label="Müşteri Seçimi"
          rules={[{ required: true, message: "Lütfen bir müşteri seçin!" }]}
          hidden={isEditing}
        >
          <Select
            showSearch
            placeholder="Müşteri Adı veya Telefon No ile Ara..."
            filterOption={false}
            onSearch={handleCustomerSearch}
            onChange={handleCustomerSelect}
            value={selectedCustomer ? selectedCustomer.id : null}
            notFoundContent={
              fetchingCustomers ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
                />
              ) : (
                "Müşteri bulunamadı"
              )
            }
            disabled={selectedCustomer !== null}
            style={{ width: "100%" }}
          >
            {searchResults.map((c) => (
              <Option key={c.id} value={c.id}>
                {`${c.fullName} - ${c.phoneNumber}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedCustomer && (
          <Alert
            message={`${selectedCustomer.fullName} (${selectedCustomer.phoneNumber})`}
            type="info"
            closable={!isEditing}
            style={{ marginBottom: 15 }}
            onClose={() => {
              setSelectedCustomer(null);
              form.setFieldsValue({ musteriId: null });
            }}
          />
        )}

        {/* 2. HİZMET SEÇİMİ */}
        <Form.Item
          name="serviceIds"
          label={`Hizmet Seçimi (Toplam: ${totalDuration} dk)`}
          rules={[
            { required: true, message: "Lütfen en az bir hizmet seçin!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Alınacak hizmetleri seçin"
            onChange={(values) => {
                setSelectedServiceIds(values);
                form.setFieldsValue({ randevuSaati: null });
            }}
            disabled={allServices.length === 0}
            value={selectedServiceIds}
          >
            {allServices.map((h) => (
              <Option key={h.id} value={h.id}>
                {`${h.ad} (${h.sureDakika} dk)`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 3. TARİH VE SAAT SEÇİMİ */}
        <Form.Item label="Randevu Tarihi ve Saati" required>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name="randevuTarihi"
              rules={[{ required: true, message: "Tarih gerekli!" }]}
              style={{ width: "50%", marginBottom: 0 }}
            >
              <DatePicker
                placeholder="Tarih Seçin"
                style={{ width: "100%" }}
                format="DD.MM.YYYY"
                disabledDate={(current) =>
                  // DÜZELTME: dayjs ile tarih kontrolü
                  current && current < dayjs().startOf("day")
                }
                onChange={(date) => {
                    setSelectedDate(date);
                    form.setFieldsValue({ randevuSaati: null });
                }}
                allowClear={false}
              />
            </Form.Item>
            <Form.Item
              name="randevuSaati"
              rules={[{ required: true, message: "Saat gerekli!" }]}
              style={{ width: "50%", marginBottom: 0 }}
            >
              <Select
                placeholder={slotLoading ? "Yükleniyor..." : "Saat seçiniz"}
                onChange={(value) => setSelectedSlot(value)}
                disabled={availableSlots.length === 0 || totalDuration === 0 || slotLoading}
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
          
          {selectedServiceIds.length > 0 && availableSlots.length === 0 && !slotLoading && totalDuration > 0 && (
            <Text type="danger" style={{ marginTop: 5, display: "block" }}>
              Seçilen hizmet süresi ({totalDuration} dk) için uygun saat bulunamadı.
            </Text>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuickAppointmentModal;