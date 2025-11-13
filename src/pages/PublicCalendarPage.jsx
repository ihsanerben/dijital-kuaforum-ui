import React from 'react';
import { Typography } from 'antd';
import PublicLayout from '../components/PublicLayout';

const PublicCalendarPage = () => (
  <PublicLayout>
    <Typography.Title level={2}>Haftalık Randevu Takvimi (Müşteri)</Typography.Title>
    <p>Aşama 3'te buraya Kuaför'ün dolu/boş saatlerini gösteren tablo gelecek.</p>
  </PublicLayout>
);

export default PublicCalendarPage;