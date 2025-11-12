// src/pages/HomePage.jsx

import React from 'react';
import { Typography } from 'antd';
import PublicLayout from '../components/PublicLayout';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <PublicLayout>
      <Title level={1}>Hoş Geldiniz!</Title>
      <Paragraph>
        Kuaförümüzün randevu ve hizmet yönetim sistemine geldiniz. 
        Yukarıdaki menüden fiyatlarımızı, hizmetlerimizi ve hakkımızdaki bilgileri inceleyebilirsiniz.
      </Paragraph>
      {/* Buraya Randevu al butonu gibi bir şey eklenebilir. */}
    </PublicLayout>
  );
};

export default HomePage;