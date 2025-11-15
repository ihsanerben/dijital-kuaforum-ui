// src/pages/AdminLoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../api/authService";
import { isAdminLoggedIn } from "../utils/storage";
import PublicLayout from "../components/PublicLayout";

const { Title } = Typography;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Ant Design mesaj API'si hook'u
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isAdminLoggedIn()) navigate("/customers", { replace: true });
  }, [navigate]);

  if (isAdminLoggedIn()) return null;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      messageApi.success("Yönetici girişi başarılı! Yönlendiriliyorsunuz...");
      navigate("/customers", { replace: true });
    } catch (error) {
      const errMsg =
        error.response?.status === 401
          ? "Kullanıcı adı veya şifre hatalı!"
          : error.response
          ? `Sunucu Hatası (${error.response.status})`
          : `Hata: ${error.message}`;
      messageApi.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <PublicLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 180px)",
          }}
        >
          <Card
            title={
              <Title level={3} style={{ marginBottom: 0 }}>
                Kuaför Yönetici Girişi
              </Title>
            }
            style={{ width: 400 }}
          >
            <Form
              name="admin_login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Lütfen kullanıcı adınızı girin!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Yönetici Kullanıcı Adı"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Yönetici Şifresi"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Giriş Yap
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </PublicLayout>
    </>
  );
};

export default AdminLoginPage;
