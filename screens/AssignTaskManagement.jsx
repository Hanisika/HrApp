import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TaskAssignScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [firmName, setFirmName] = useState('');
  const [assignedBy, setAssignedBy] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const firm = await AsyncStorage.getItem('firmName');
      const hrEmail = await AsyncStorage.getItem('hrEmail');
      setFirmName(firm || '');
      setAssignedBy(hrEmail || '');
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !employeeEmail) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }

    try {
      const res = await axios.post('http://192.168.190.151:5000/task/assign', {
        title,
        description,
        dueDate,
        employeeEmail,
        assignedBy,
        firmName
      });

      console.log('✅ Task assigned:', res.data);
      Alert.alert('Success', 'Task assigned successfully.');
      setTitle('');
      setDescription('');
      setEmployeeEmail('');
    } catch (err) {
      console.log('❌ Task assign error:', err);
      Alert.alert('Error', 'Could not assign task.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Task Description"
        value={description}
        multiline
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Assign to (Employee Email)"
        keyboardType="email-address"
        value={employeeEmail}
        onChangeText={setEmployeeEmail}
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Ionicons name="calendar" size={20} color="#fff" />
        <Text style={styles.dateText}>{dueDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setDueDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Assign Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskAssignScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#f1f2f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  dateText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16
  },
  button: {
    backgroundColor: '#00b894',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
