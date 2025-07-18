import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, Button, TouchableOpacity,
  ScrollView, Alert, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployeeForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [joinDate, setJoinDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [firmName, setFirmName] = useState('');

  const designationOptions = {
    IT: ['Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
    Finance: ['Accounts Manager', 'Auditor'],
    HR: ['Recruiter', 'Payroll Officer'],
  };

useEffect(() => {
  const getFirmName = async () => {
    try {
      const firm = await AsyncStorage.getItem('firmName');
      console.log('📦 Firm from AsyncStorage:', firm);
      if (firm) {
        setFirmName(firm);
      } else {
        console.warn('⚠️ firmName not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching firmName from storage:', error);
    }
  };

  getFirmName();
}, []);


  const handleSubmit = async () => {
    if (!name || !email || !phone || !joinDate || !department || !designation || !firmName) {
      console.log('🛑 Missing Fields:', { name, email, phone, joinDate, department, designation, firmName });
  Alert.alert('Validation Error', 'Please fill in all required fields.');
  return;
    }

    const employeeData = {
      name,
      email,
      phone,
      joiningDate: joinDate.toISOString(),
      department,
      designation,
      firmName,
      role: 'employee',
      password: 'default123' // Default password
    };

    console.log('📤 Submitting employee:', employeeData);

    try {
      const res = await axios.post('http://192.168.190.151:5000/add-employee', employeeData, {
        timeout: 5000
      });

      if (res.data.success) {
        Alert.alert('Success', 'Employee added successfully');
        setName('');
        setEmail('');
        setPhone('');
        setJoinDate(new Date());
        setDepartment('');
        setDesignation('');
      } else {
        Alert.alert('Error', res.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Axios error:', error.message);
      if (error.response) {
        console.log('📡 Server responded with:', error.response.status, error.response.data);
        Alert.alert('Server Error', error.response.data.message || 'Something went wrong');
      } else if (error.request) {
        console.log('⛔ No response received');
        Alert.alert('Network Error', 'No response from server');
      } else {
        console.log('⚠️ Error in request setup:', error.message);
        Alert.alert('Error', 'Request setup error');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Add New Employee</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Joining Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text>{joinDate.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={joinDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || joinDate;
              setShowDatePicker(Platform.OS === 'ios');
              setJoinDate(currentDate);
            }}
          />
        )}

        <Text style={styles.label}>Department</Text>
        <Picker
          selectedValue={department}
          onValueChange={(value) => {
            setDepartment(value);
            setDesignation('');
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Department" value="" />
          <Picker.Item label="IT" value="IT" />
          <Picker.Item label="Finance" value="Finance" />
          <Picker.Item label="HR" value="HR" />
        </Picker>

        <Text style={styles.label}>Designation</Text>
        <Picker
          selectedValue={designation}
          onValueChange={setDesignation}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Designation --" value="" />
          {(designationOptions[department] || []).map((desig, index) => (
            <Picker.Item key={index} label={desig} value={desig} />
          ))}
        </Picker>

        <View style={styles.button}>
          <Button title="Submit" color="purple" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default EmployeeForm;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  box: {
    borderRadius: 20,
    backgroundColor: 'purple',
    padding: 20,
    width: '90%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  input: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  datePicker: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 20,
  },
  button: {
    height: 50,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
