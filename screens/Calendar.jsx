import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const CalendarTab = () => {
  const [attendanceMap, setAttendanceMap] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const loadAttendance = async () => {
    const email = await AsyncStorage.getItem('hrEmail');
    if (!email) return;

    try {
      const res = await axios.get(`http://192.168.190.151:5000/attendance/${email}`);
      const data = res.data.attendance || [];

      const map = {};
      const marks = {};

      data.forEach(item => {
        map[item.date] = {
          punchIn: item.punchIn || '-',
          punchOut: item.punchOut || '-',
          punchInLocation: item.punchInLocation || 'Location not recorded',
          punchOutLocation: item.punchOutLocation || 'Location not recorded',
        };

        marks[item.date] = {
          marked: true,
          dotColor: item.punchOut ? 'green' : 'orange',
          customStyles: {
            container: { backgroundColor: '#dfe6e9' },
            text: { color: '#2d3436' },
          },
        };
      });

      setAttendanceMap(map);
      setMarkedDates(marks);
    } catch (err) {
      console.log('❌ Attendance fetch error:', err.message);
    }
  };

  // 🔁 Reload data every time screen/tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadAttendance();
    }, [])
  );

  const handleDayPress = (day) => {
    const record = attendanceMap[day.dateString];

    console.log("📅 Selected Record:", record);

    if (record) {
      Alert.alert(
        `📅 ${day.dateString}`,
        `🕒 Punch In: ${record.punchIn}\n📍 In Location: ${record.punchInLocation}\n\n🕓 Punch Out: ${record.punchOut}\n📍 Out Location: ${record.punchOutLocation}`
      );
    } else {
      Alert.alert("No attendance for this day");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Calendar</Text>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#6c5ce7',
          arrowColor: '#6c5ce7',
          selectedDayBackgroundColor: '#74b9ff',
        }}
      />
    </View>
  );
};

export default CalendarTab;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  }
});
