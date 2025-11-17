// src/pages/PublicCalendarPage.jsx - FİNAL KOD (10 DK'LIK BLOKLAR VE SLOT ATLAMA ÇÖZÜMÜ)

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Table, Button, message, Spin, Space, DatePicker, App } from 'antd'; // App import edildi
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/tr'; // Türkçe dil paketi
import PublicLayout from '../components/PublicLayout';
import { getAppointmentsForCalendar } from '../api/appointmentService'; 
import { isCustomerLoggedIn } from '../utils/storage'; 

const { Title, Text } = Typography;
moment.locale('tr'); // Dil ayarı yapıldı

const IS_BASLANGIC_SAATI = 9; // 09:00
const IS_BITIS_SAATI = 18;   // 18:00
const TIME_STEP_MINUTES = 10; // 👈 KRİTİK DEĞER: 10 dakikalık dilim

const PublicCalendarPage = () => {
    // message servisine güvenli erişim
    const { message } = App.useApp();
    
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('isoWeek')); 
    const [weeklySchedule, setWeeklySchedule] = useState({}); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const loggedIn = isCustomerLoggedIn();

    // --- YARDIMCI MANTIK VE VERİ ÇEKME ---
    
    // 10 DAKİKALIK ZAMAN DİLİMİ OLUŞTURMA VE ÇAKIŞMA MANTIĞI
    const generateTimeSlots = (appointments, date) => {
        const slots = [];
        let currentTime = date.clone().set({ hour: IS_BASLANGIC_SAATI, minute: 0, second: 0 });
        const endTimeLimit = date.clone().set({ hour: IS_BITIS_SAATI, minute: 0, second: 0 });
        
        // 1. Tüm 10 dakikalık slotları baştan oluştur
        while (currentTime.isBefore(endTimeLimit)) {
            slots.push({
                key: currentTime.format('HH:mm'),
                time: currentTime.format('HH:mm'),
                status: 'MÜSAİT',
                startTime: currentTime.toISOString(), 
                durationMinutes: TIME_STEP_MINUTES
            });
            currentTime = currentTime.clone().add(TIME_STEP_MINUTES, 'minutes');
        }

        // 2. Randevuları Kontrol Et ve Karşılık Gelen Slotları Bloke Et
        appointments.forEach(app => {
            const appStart = moment(app.startTime);
            const appEnd = moment(app.endTime);
            
            // Randevu süresi boyunca tüm 10 dakikalık blokları gez
            let slotChecker = appStart.clone().startOf('minute');
            if (slotChecker.minute() % TIME_STEP_MINUTES !== 0) {
                slotChecker.minutes(Math.floor(slotChecker.minute() / TIME_STEP_MINUTES) * TIME_STEP_MINUTES);
            }
            
            let isFirstSlot = true; // Sadece ilk slot için etiket göster
            
            while (slotChecker.isBefore(appEnd)) {
                const slotKey = slotChecker.format('HH:mm');
                const foundSlotIndex = slots.findIndex(s => s.time === slotKey);
                
                if (foundSlotIndex !== -1) {
                    const slot = slots[foundSlotIndex];
                    
                    if (slot.status === 'MÜSAİT') { // Başka bir randevu tarafından bloke edilmemişse
                        slot.status = app.status; // BEKLEMEDE veya ONAYLANDI
                        
                        if (isFirstSlot) {
                             slot.isStart = true; // Sadece başlangıç slotu için işaretle
                        }
                    }
                }
                
                isFirstSlot = false; // Bir sonraki slot başlangıç değildir
                slotChecker = slotChecker.clone().add(TIME_STEP_MINUTES, 'minutes');
            }
        });

        return slots;
    };


    const fetchWeeklyAppointments = useCallback(async (weekStart) => {
        setLoading(true);
        const weekDates = [];
        const newWeeklySchedule = {};
        
        for (let i = 0; i < 7; i++) {
            weekDates.push(weekStart.clone().add(i, 'days'));
        }

        try {
            const fetchPromises = weekDates.map(async (date) => {
                const dateString = date.format('YYYY-MM-DD');
                const response = await getAppointmentsForCalendar(dateString);
                
                const activeAppointments = (response.data || []).filter(app =>
                    app.status === 'ONAYLANDI' || app.status === 'BEKLEMEDE'
                );
                
                newWeeklySchedule[dateString] = generateTimeSlots(activeAppointments, date);
            });
            
            await Promise.all(fetchPromises);
            setWeeklySchedule(newWeeklySchedule);

        } catch (error) {
            message.error("Haftalık takvim verileri yüklenemedi.");
            console.error("Haftalık Takvim Hatası:", error);
            setWeeklySchedule({});
        } finally {
            setLoading(false);
        }
    }, [message]);


    useEffect(() => {
        fetchWeeklyAppointments(currentWeekStart);
    }, [currentWeekStart, fetchWeeklyAppointments]);
    
    // --- NAVİGASYON VE RENDER İŞLEMLERİ ---

    const handlePreviousWeek = () => {
        setCurrentWeekStart(currentWeekStart.clone().subtract(7, 'days'));
    };

    const handleNextWeek = () => {
        setCurrentWeekStart(currentWeekStart.clone().add(7, 'days'));
    };

    const handleRandevuAl = (dateIso) => {
        if (loggedIn) {
            navigate(`/appointment?date=${dateIso}`);
        } else {
            message.warning("Randevu almak için lütfen giriş yapınız.");
            navigate('/userAuth');
        }
    };
    
    const getRowData = () => {
        // İlk günün (Pazartesi) programını referans al
        const refDate = currentWeekStart.format('YYYY-MM-DD');
        const refSchedule = weeklySchedule[refDate] || [];

        return refSchedule.map(slot => {
            const row = { 
                key: slot.time, 
                time: <Text strong>{slot.time}</Text>
            };
            
            for (let i = 0; i < 7; i++) {
                const currentDate = currentWeekStart.clone().add(i, 'days').format('YYYY-MM-DD');
                const daySchedule = weeklySchedule[currentDate] || [];
                // Karşılık gelen saati bul
                const currentSlot = daySchedule.find(s => s.time === slot.time);
                
                if (currentSlot) {
                    row[currentDate] = currentSlot;
                } else {
                    // Çalışma saatleri dışı (10'ar dakika aralıklı loop'ta kalmayan)
                    row[currentDate] = { status: 'DOLU' }; 
                }
            }
            return row;
        });
    };

    const getColumns = () => {
        const columns = [{ 
            title: <Text strong>Saat</Text>, 
            dataIndex: 'time', 
            key: 'time', 
            width: 80, 
            fixed: 'left' 
        }];
        
        for (let i = 0; i < 7; i++) {
            const date = currentWeekStart.clone().add(i, 'days');
            const dateString = date.format('YYYY-MM-DD');
            
            columns.push({
                title: (
                    <>
                        <Text strong style={{ fontSize: '14px' }}>{date.format('dddd').toUpperCase()}</Text>
                        <br />
                        <Text style={{ opacity: 0.6 }}>{date.format('DD/MM/YYYY')}</Text>
                    </>
                ), 
                dataIndex: dateString,
                key: dateString,
                width: 150,
                render: (slot) => {
                    const isAvailable = slot.status === 'MÜSAİT';
                    const isPending = slot.status === 'BEKLEMEDE';
                    const isBooked = slot.status === 'ONAYLANDI' || slot.status === 'DOLU';
                    const isStartSlot = slot.isStart; // Yeni işaretlediğimiz başlangıç slotu
                    
                    const color = isBooked ? 'red' : isPending ? 'orange' : 'gray';

                    // MÜSAİT ise butonu göster
                    if (isAvailable) {
                        return (
                             <Button 
                                type="primary" 
                                size="small" 
                                onClick={() => handleRandevuAl(slot.startTime)}
                                className="randevu-al-btn" 
                                style={{ opacity: 0.3, transition: 'opacity 0.3s' }} 
                            >
                                Randevu Al
                            </Button>
                        );
                    }
                    
                    // Slot Dolu/Beklemede VE bu randevunun başlangıç slotu ise, statüyü göster.
                    if (isStartSlot || slot.status === 'REDDEDİLDİ') {
                        return (
                            <Text style={{ color: color, fontWeight: 'bold' }}>
                                {isBooked ? 'DOLU' : 'BEKLEMEDE'} 
                            </Text>
                        );
                    }
                    
                    // Slot Dolu/Beklemede AMA başlangıç slotu değilse, boş bırak.
                    return null; // CSS ile hücrenin birleşmesi sağlanır.
                }
            });
        }
        return columns;
    };
    
    const weekDisplay = `${currentWeekStart.format('DD/MM/YYYY')} - ${currentWeekStart.clone().add(6, 'days').format('DD/MM/YYYY')}`;

    return (
        <PublicLayout>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Title level={2}>Haftalık Randevu Takvimi</Title>
                    <Text>Kuaförümüzün haftalık müsait saatlerini 10 dakikalık dilimlerle görebilirsiniz.</Text>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={handlePreviousWeek} />
                        <Title level={4} style={{ margin: 0 }}>{weekDisplay}</Title>
                        <Button icon={<ArrowRightOutlined />} onClick={handleNextWeek} />
                    </Space>
                </Col>
            </Row>

            <Spin spinning={loading}>
                <Table 
                    columns={getColumns()} 
                    dataSource={getRowData()} 
                    pagination={false} 
                    bordered
                    scroll={{ x: 1200, y: 700 }}
                    size="small"
                    locale={{ emptyText: "Bu haftaya ait randevu verisi bulunmamaktadır." }}
                />
            </Spin>
        </PublicLayout>
    );
};

export default PublicCalendarPage;