// src/pages/PublicCalendarPage.jsx - SON STİL DÜZENLEMELERİ

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Table, Button, message, Spin, Space, DatePicker } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/tr';
import PublicLayout from '../components/PublicLayout';
import { getAppointmentsForCalendar } from '../api/appointmentService'; 
import { isCustomerLoggedIn } from '../utils/storage'; 

const { Title, Text } = Typography;
moment.locale('tr'); 

const IS_BASLANGIC_SAATI = 9;
const IS_BITIS_SAATI = 18;
const TIME_STEP_MINUTES = 5;

const PublicCalendarPage = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('week').isoWeekday(1)); 
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const loggedIn = isCustomerLoggedIn();

    // ... (generateTimeSlots ve fetchWeeklyAppointments fonksiyonları aynı kalır)
    
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
    }, []);
    
    const generateTimeSlots = (appointments, date) => {
        // ... (5 dakikalık dilim mantığı aynı kalır) ...
        const slots = [];
        let currentTime = date.clone().set({ hour: IS_BASLANGIC_SAATI, minute: 0, second: 0 });
        const endTimeLimit = date.clone().set({ hour: IS_BITIS_SAATI, minute: 0, second: 0 });
        
        while (currentTime.isBefore(endTimeLimit)) {
            let isSlotAvailable = true;
            let blockingAppointmentEnd = null; 
            let blockingStatus = null; 
            
            const slotStart = currentTime.clone();
            const slotEnd = currentTime.clone().add(TIME_STEP_MINUTES, 'minutes');
            
            appointments.forEach(app => {
                const appStart = moment(app.startTime);
                const appEnd = moment(app.endTime);
                
                if (slotStart.isBefore(appEnd) && slotEnd.isAfter(appStart)) {
                    isSlotAvailable = false;
                    blockingAppointmentEnd = appEnd;
                    blockingStatus = app.status; 
                }
            });

            if (!isSlotAvailable && blockingAppointmentEnd) {
                 const formattedSlot = slotStart.format('HH:mm');
                 slots.push({
                     key: formattedSlot,
                     time: formattedSlot,
                     status: blockingStatus === 'ONAYLANDI' ? 'DOLU' : 'BEKLEMEDE',
                 });
                
                 currentTime = blockingAppointmentEnd;
                 continue; 
            }
            
            slots.push({
                key: slotStart.format('HH:mm'),
                time: slotStart.format('HH:mm'),
                status: 'MÜSAİT',
                startTime: slotStart.toISOString(), 
            });
            
            currentTime = slotEnd;
        }

        return slots;
    };


    useEffect(() => {
        fetchWeeklyAppointments(currentWeekStart);
    }, [currentWeekStart, fetchWeeklyAppointments]);
    
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
        const refDate = currentWeekStart.format('YYYY-MM-DD');
        const refSchedule = weeklySchedule[refDate] || [];

        return refSchedule.map(slot => {
            // SAAT KOLONUNU BOLD YAPMAK İÇİN SİLME İŞLEMİ GEREKEBİLİR
            const row = { 
                key: slot.time, 
                time: <Text strong>{slot.time}</Text> // SAATLERİ BOLD YAP
            };
            
            for (let i = 0; i < 7; i++) {
                const currentDate = currentWeekStart.clone().add(i, 'days').format('YYYY-MM-DD');
                const daySchedule = weeklySchedule[currentDate] || [];
                const currentSlot = daySchedule.find(s => s.time === slot.time);
                
                if (currentSlot) {
                    row[currentDate] = currentSlot;
                } else {
                    row[currentDate] = { status: 'KAPALI' }; 
                }
            }
            return row;
        });
    };

    // Tablonun kolonlarını oluşturur (Pazartesi, Salı, ...)
    const getColumns = () => {
        const columns = [{ 
            title: <Text strong>Saat</Text>, // KOLON BAŞLIĞINI BOLD YAP
            dataIndex: 'time', 
            key: 'time', 
            width: 80, 
            fixed: 'left' 
        }];
        
        for (let i = 0; i < 7; i++) {
            const date = currentWeekStart.clone().add(i, 'days');
            const dateString = date.format('YYYY-MM-DD');
            
            columns.push({
                // GÜN ADINI BOLD, TARİHİ SAYDAM YAP
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
                    const isClosed = slot.status === 'KAPALI';
                    const isPending = slot.status === 'BEKLEMEDE';
                    const isBooked = slot.status === 'DOLU';

                    const color = isBooked ? 'red' : isPending ? 'orange' : 'gray';

                    return isAvailable ? (
                        <Button 
                            type="primary" 
                            size="small" 
                            onClick={() => handleRandevuAl(slot.startTime)}
                            className="randevu-al-btn" // CSS için sınıf etiketi
                            style={{ transition: 'opacity 0.3s' }} // Varsayılan saydamlık
                        >
                            Randevu Al
                        </Button>
                    ) : isClosed ? (
                        <Text type="secondary">Kapalı</Text>
                    ) : (
                        <Text style={{ color: color, fontWeight: 'bold' }}>
                            {slot.status}
                        </Text>
                    );
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
                    <Text>Kuaförümüzün haftalık müsait saatlerini 5 dakikalık dilimlerle görebilirsiniz.</Text>
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