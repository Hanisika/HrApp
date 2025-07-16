import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native';


const DashboardContent = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const { role } = route.params || '';
  const [email, setEmail] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState('');
  const [punchOutTime, setPunchOutTime] = useState('');
  const [duration, setDuration] = useState('');
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
const [userName, setUserName] = useState('');

useEffect(() => {
  const init = async () => {
    const storedEmail = await AsyncStorage.getItem('hrEmail');
    const storedName = await AsyncStorage.getItem('userName'); // <- get name
    if (storedEmail) {
      setEmail(storedEmail);
      setUserName(storedName || ''); // <- set name to state
      fetchAttendance(storedEmail);
      checkPunchStatus(storedEmail);
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('🔐 Location permission status:', status);
  };

  init();
}, []);

useEffect(() => {
  const init = async () => {
    const storedEmail = await AsyncStorage.getItem('hrEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchAttendance(storedEmail);
      checkPunchStatus(storedEmail);
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('🔐 Location permission status:', status);
  };

  init();
}, []);

const getCurrentLocationName = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Permission Denied');
      return 'Permission Denied';
    }

    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      console.log('⚠️ Location Services Disabled');
      return 'Location Services Disabled';
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    console.log('📍 Coordinates:', location.coords);

    const addressArray = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    console.log('📦 Reverse Geocode Response:', addressArray);

    if (!addressArray || addressArray.length === 0) {
      return `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`;
    }

    const { name, street, city, region, country, postalCode } = addressArray[0];
    const fullAddress = `${name || ''}, ${street || ''}, ${city || ''}, ${region || ''}, ${postalCode || ''}, ${country || ''}`;
    
    console.log('✅ Full Address:', fullAddress);
    return fullAddress || `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`;
  } catch (error) {
    console.log('❌ Location error:', error.message);
    return 'Error fetching location';
  }
};




  const fetchAttendance = async (email) => {
    try {
      await axios.get(`http://192.168.190.151:5000/attendance/${email}`);
    } catch (err) {
      console.log("❌ Attendance fetch error:", err.message);
    }
  };

  const checkPunchStatus = async (email) => {
    const today = new Date().toISOString().split('T')[0];
    const res = await axios.get(`http://192.168.190.151:5000/attendance/${email}`);
    const todayRecord = res.data.attendance.find(item => item.date === today);

    if (todayRecord) {
      setPunchInTime(todayRecord.punchIn);
      if (todayRecord.punchOut) {
        setPunchOutTime(todayRecord.punchOut);
        setDuration(todayRecord.duration || '');
        setIsPunchedIn(false);
      } else {
        setIsPunchedIn(true);
        const punchInDate = new Date(`${today}T${todayRecord.punchIn}`);
        const seconds = Math.floor((Date.now() - punchInDate.getTime()) / 1000);
        setTimer(seconds);
        startTimer(seconds);
      }
    }
  };

  const startTimer = (initial = 0) => {
    const id = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

const handlePunch = async () => {
   setLoading(true);
  try {
    const userEmail = await AsyncStorage.getItem('hrEmail');
    const locationTitle = await getCurrentLocationName();

    console.log('📍 Punch locationTitle:', locationTitle);

    const res = await axios.post('http://192.168.190.151:5000/attendance/punch', {
      userEmail,
      location: locationTitle || 'Unknown location',  // ✅ always send a string
    });

    const { status: punchStatus, record } = res.data;

    console.log('✅ Punch response:', punchStatus, record);

    if (punchStatus === 'PUNCHED_IN') {
      setIsPunchedIn(true);
      setPunchInTime(record.punchIn);
      startTimer();
    } else if (punchStatus === 'PUNCHED_OUT') {
      setIsPunchedIn(false);
      setPunchOutTime(record.punchOut);
      setDuration(record.duration);
      stopTimer();
    } else if (punchStatus === 'UPDATED_LOCATION') {
      Alert.alert('Info', 'Missing location filled in successfully.');
    }

    fetchAttendance(userEmail);
  } catch (err) {
    console.log("❌ Punch error:", err.message);
  }
   setLoading(false); 
};



  return (
    <ScrollView contentContainerStyle={styles.container}>
     <Text style={styles.header}>Welcome, { userName || role}</Text>


      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Attendance</Text>
        <Text>Punch In: {punchInTime || '-'}</Text>
        <Text>Punch Out: {punchOutTime || '-'}</Text>
        <Text>
          {isPunchedIn
            ? `Working Time: ${formatDuration(timer)}`
            : `Total Duration: ${duration || '-'}`}
        </Text>

        
      </View>



{loading ? (
  <TouchableOpacity style={styles.loadingBtn} disabled>
    <ActivityIndicator color="#fff" size="small" />
  </TouchableOpacity>
) : (
  <TouchableOpacity
    style={isPunchedIn ? styles.punchOut : styles.punchIn}
    onPress={handlePunch}
  >
    <Text style={styles.btnText}>{isPunchedIn ? 'Punch Out' : 'Punch In'}</Text>
  </TouchableOpacity>
)}

    </ScrollView>
  );
};

export default DashboardContent;

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#ffeaa7',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  punchIn: {
    backgroundColor: '#00b894',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15
  },
  punchOut: {
    backgroundColor: '#d63031',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  loadingBtn: {
  backgroundColor: '#3ef18f',
  padding: 12,
  borderRadius: 8,
  width: '100%',
  alignItems: 'center',
  marginBottom: 15,
},


});
