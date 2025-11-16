import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Form,
  Checkbox,
  Button,
  Spin,
  Alert,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import PublicLayout from "../components/PublicLayout";
import { getAllHizmetler } from "../api/hizmetService";
import { createAppointment } from "../api/appointmentService";
import { isCustomerLoggedIn } from "../utils/storage";
const { Title, Text } = Typography;

const AppointmentPage = () => {
  const [hizmetler, setHizmetler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const loggedIn = isCustomerLoggedIn();
  const [messageApi, contextHolder] = message.useMessage();

  const queryParams = new URLSearchParams(location.search);
  const startTimeIso = queryParams.get("date");

  useEffect(() => {
    if (!startTimeIso) {
      setTimeout(() => {
        navigate("/calendar", { replace: true });
      }, 1000);
      return;
    }

    if (loggedIn) {
      (async () => {
        try {
          const response = await getAllHizmetler();
          const formatted = response.data.map((h) => ({
            label: `${h.ad} (${h.sureDakika} dk - ${h.fiyat} TL)`,
            value: h.id,
            duration: h.sureDakika,
          }));
          setHizmetler(formatted);
        } catch (error) {
          console.error("Hizmet Çekme Hatası:", error);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [startTimeIso, navigate, loggedIn, messageApi]);

  const onFinish = async (values) => {
    if (!values.hizmetIdleri?.length) {
      messageApi.warning("En az bir hizmet seçiniz.");
    }
    if (!loggedIn) {
      messageApi.error("Randevu için giriş yapınız.");
      setTimeout(() => {
        navigate("/userAuth", { replace: true });
      }, 1000);
      return;
    }

    setIsSubmitting(true);
    try {
      await createAppointment(startTimeIso, values.hizmetIdleri);
      const selected = hizmetler.filter((h) =>
        values.hizmetIdleri.includes(h.value)
      );
      const totalDuration = selected.reduce((sum, h) => sum + h.duration, 0);

      messageApi.success({
        content: (
                    <div>
                        <Text strong style={{ fontSize: '15px' }}>Randevu talebiniz başarıyla alındı!</Text>
                        
                        <p style={{ margin: '5px 0 2px 0' }}>
                            <Text strong style={{ color: '#0050b3' }}>
                                {moment(startTimeIso).format('dddd HH:mm')}
                            </Text>
                            <Text type="secondary"> ({totalDuration} dk)</Text>
                        </p>
                        
                        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                            {/* Tarihi Alt Satırda, Sönük Göster */}
                            Tarih: {moment(startTimeIso).format('DD/MM/YYYY')}
                        </Text>

                        <Text type="secondary" style={{ display: 'block', marginTop: 5 }}>
                            Kuaför onayı bekleniyor. Onaylandığında bilgi alacaksınız.
                        </Text>
                    </div>
                ),
                duration: 5, 
            });
      setTimeout(() => {
        navigate("/calendar", { replace: true });
      }, 5000);
    } catch (error) {
      if (error.response?.status === 409) {
        messageApi.error(
          "Seçilen saat başkası tarafından alınmış veya çakışma oluştu."
        );
      } else {
        messageApi.error(
          error.response?.data || "Randevu oluşturulurken bir hata oluştu."
        );
      }
      console.error("Randevu Hata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!startTimeIso)
    return (
      <>
        {contextHolder}
        <PublicLayout>
          <Spin tip="Yönlendiriliyor..." />
        </PublicLayout>
      </>
    );

  const selectedHizmetler = hizmetler.filter((h) =>
    (form.getFieldValue("hizmetIdleri") || []).includes(h.value)
  );
  const totalDuration = selectedHizmetler.reduce(
    (sum, h) => sum + h.duration,
    0
  );
  const endTime = moment(startTimeIso)
    .add(totalDuration, "minutes")
    .format("HH:mm");

  const FormContent = () => {
    if (!loggedIn)
      return (
        <>
          {contextHolder}
          <Alert
            message="Giriş Yapınız"
            description="Randevu oluşturmak için giriş yapın veya üye olun."
            type="warning"
            showIcon
            action={
              <Button
                size="small"
                type="primary"
                onClick={() => navigate("/userAuth")}
              >
                Giriş Yap / Üye Ol
              </Button>
            }
          />
        </>
      );

    return (
      <Spin spinning={loading || isSubmitting}>
        <Form
          form={form}
          name="appointment_form"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ hizmetIdleri: [] }}
        >
          <Form.Item
            name="hizmetIdleri"
            label={<Title level={5}>Almak İstediğiniz Hizmetler</Title>}
            rules={[{ required: true, message: "En az bir hizmet seçiniz." }]}
          >
            <Checkbox.Group options={hizmetler} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmitting}
            >
              Randevu Talebini Gönder (
              {totalDuration > 0 ? totalDuration + " dk" : ""})
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  };

  return (
    <>
      {contextHolder}
      <PublicLayout>
        <Title level={2}>Randevu Oluşturma</Title>
        <Card style={{ maxWidth: 600, margin: "0 auto" }}>
          <Text strong style={{ fontSize: "18px" }}>
            Seçilen Başlangıç Saati:
          </Text>
          <Title level={4} style={{ color: "#695acb", marginTop: 0 }}>
            {moment(startTimeIso).format("DD MMMM YYYY - HH:mm")}
          </Title>
          {totalDuration > 0 && (
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 20 }}
            >
              Tahmini Bitiş: {endTime} (Toplam Süre: {totalDuration} dk)
            </Text>
          )}
          <FormContent />
        </Card>
      </PublicLayout>{" "}
    </>
  );
};

export default AppointmentPage;
