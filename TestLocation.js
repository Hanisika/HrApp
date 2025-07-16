import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

const TestLocation = () => {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState(null);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Alert.alert('Location Services Disabled', 'Please enable location services.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      console.log('📍 Coordinates:', location.coords);
      setCoords(location.coords);

      const addressArray = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log('📦 Reverse Geocode Response:', addressArray);

      if (addressArray.length === 0) {
        setAddress('❌ No address found');
        return;
      }

      const { name, street, city, region, country, postalCode } = addressArray[0];
      const fullAddress = `${name || ''}, ${street || ''}, ${city || ''}, ${region || ''}, ${postalCode || ''}, ${country || ''}`;
      setAddress(fullAddress);
      console.log('✅ Full Location:', fullAddress);

    } catch (error) {
      console.log('❌ Location error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📍 Location Tester</Text>
      <Button title="Fetch Location" onPress={fetchLocation} />
      <Text style={styles.label}>Latitude: {coords?.latitude || '---'}</Text>
      <Text style={styles.label}>Longitude: {coords?.longitude || '---'}</Text>
      <Text style={styles.label}>Address: {address || '---'}</Text>
    </View>
  );
};

export default TestLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  }
});
