import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Credentials', 'Email or password cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.190.151:5000/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      if (response.data.success) {
        const { role, hrEmail, firmName } = response.data;

        if (hrEmail) {
          await AsyncStorage.setItem('hrEmail', hrEmail);
          await AsyncStorage.setItem('firmName', firmName || '');
        }

        navigation.navigate(role === 'hr' ? 'HRDashboard' : 'Dashboard', { role });
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Server Error', 'Unable to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Manager Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#6c5ce7',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#00cec9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
