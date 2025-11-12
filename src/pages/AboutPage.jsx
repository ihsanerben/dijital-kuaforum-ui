// src/pages/AboutPage.jsx GÜNCELLENMİŞ KOD

import React from 'react';
import { Typography, Divider } from 'antd';
import PublicLayout from '../components/PublicLayout'; 

const { Title, Paragraph } = Typography;

const AboutPage = () => {
  return (
    <PublicLayout>
      <Title level={2}>Kuaförümüz Hakkında</Title>
      <Paragraph style={{ fontSize: '16px' }}>
        [Kuaför Adı], [Kuruluş Yılı]'ndan beri sektörde kalitenin ve müşteri memnuniyetinin adresi olmuştur. 
        Amacımız, her ziyaretçimizi sadece saç ve sakal stili ile değil, aynı zamanda ruhunu dinlendirmiş bir şekilde uğurlamaktır.
      </Paragraph>

      <Divider orientation="left">Vizyonumuz</Divider>
      <Paragraph>
        Bölgesinde lider, trendleri belirleyen ve daima en iyi hizmeti sunan bir kuaför olmak. Teknoloji ile geleneksel sanatı harmanlayarak, müşterilerimize zamandan bağımsız bir şıklık sunmak.
      </Paragraph>

      <Divider orientation="left">Misyonumuz</Divider>
      <Paragraph>
        Uzman ekibimizle hijyenik ve sıcak bir ortamda kişiye özel stil danışmanlığı sağlamak. Kaliteli ürünler kullanarak saç ve cilt sağlığınızı ön planda tutmak ve her hizmetten sonra tam memnuniyetinizi garanti etmek.
      </Paragraph>
      
      <Divider orientation="left">Ekibimiz</Divider>
      <Paragraph>
        Baş Kuaför [Kuaför Adı]'nın liderliğinde, her biri kendi alanında uzmanlaşmış yetenekli bir ekibiz. Sizin için en uygun stili yaratmaktan mutluluk duyarız.
      </Paragraph>
      
    </PublicLayout>
  );
};

export default AboutPage;