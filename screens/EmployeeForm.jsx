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
  const [show, setShow] = useState(false);
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [firmName, setFirmName] = useState('');

  const designationOptions = {
    IT: ['Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
    Finance: ['Accounts Manager', 'Auditor'],
    HR: ['Recruiter', 'Payroll Officer'],
  };

  useEffect(() => {
    const loadHRData = async () => {
      const storedFirm = await AsyncStorage.getItem('firmName');
      if (storedFirm) setFirmName(storedFirm);
    };
    loadHRData();
  }, []);
const handleSubmit = async () => {
  if (!name || !email || !phone || !joinDate || !department || !designation || !firmName) {
    Alert.alert('Validation Error', 'Please fill all required fields.');
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
    role: 'employee'
  };

  console.log('Submitting employee:', employeeData);

 try {
  const res = await axios.post('http://192.168.190.151:5000/add-employee/', employeeData, {
    timeout: 5000
  });
  console.log('✅ Axios response:', res.data); // log full response

 if (res.data.success) {
  setTimeout(() => {
    Alert.alert('Success', 'Employee added successfully');
  }, 100);

  // ✅ Reset form fields
  setName('');
  setEmail('');
  setPhone('');
  setJoinDate(new Date());
  setDepartment('');
  setDesignation('');
}
} catch (error) {
  console.error('❌ Axios error:', error.message);
  if (error.response) {
    console.log('📡 Server responded:', error.response.status, error.response.data);
  } else if (error.request) {
    console.log('⛔ No response received');
  } else {
    console.log('⚠️ Error in setup:', error.message);
  }
}
}



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
          autoCapitalize="none"
          keyboardType="email-address"
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
        <TouchableOpacity onPress={() => setShow(true)} style={styles.datePicker}>
          <Text>{joinDate.toDateString()}</Text>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            value={joinDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || joinDate;
              setShow(Platform.OS === 'ios');
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
          <Picker.Item label="Select department" value="" />
          <Picker.Item label="IT" value="IT" />
          <Picker.Item label="Finance" value="Finance" />
          <Picker.Item label="HR" value="HR" />
        </Picker>

        <Text style={styles.label}>Designation</Text>
        <Picker
          selectedValue={designation}
          onValueChange={(value) => setDesignation(value)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Designation --" value="" />
          {(designationOptions[department] || []).map((d, i) => (
            <Picker.Item key={i} label={d} value={d} />
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
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
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
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  datePicker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    justifyContent: 'center',
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'white',
  },
});
