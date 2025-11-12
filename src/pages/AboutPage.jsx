// src/pages/AboutPage.jsx

import React from 'react';
import { Typography } from 'antd';
// Eski import'u silin veya PublicLayout ile değiştirin
import PublicLayout from '../components/PublicLayout'; 

const { Title } = Typography;

const AboutPage = () => {
  return (
    <PublicLayout>
      <Title level={2}>Hakkımızda</Title>
      <p>Bu sayfada kuaförünüzle ilgili genel bilgiler, vizyon ve misyon yer alacaktır.</p>
    </PublicLayout>
  );
};

export default AboutPage;