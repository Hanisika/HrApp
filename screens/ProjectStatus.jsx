import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProjectStatus() {
  const [employeeData, setEmployeeData] = useState(null);
  const [updateLink, setUpdateLink] = useState('');
  const [submittedUpdates, setSubmittedUpdates] = useState([]);

  useEffect(() => {
    fetchEmployeeDetails();
    fetchSubmittedUpdates();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const response = await axios.get(`http://192.168.190.151:5000/get-employee/${email}`);
      setEmployeeData(response.data.employee);
    } catch (err) {
      console.error('Error fetching employee details:', err);
    }
  };

  const fetchSubmittedUpdates = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const response = await axios.get(`http://192.168.190.151:5000/updates/${email}`);
      setSubmittedUpdates(response.data.updates);
    } catch (err) {
      console.error('Error fetching updates:', err);
    }
  };

  const handleSubmitUpdate = async () => {
    if (!updateLink.trim()) {
      Alert.alert('Validation', 'Please enter a valid update link');
      return;
    }

    try {
      const email = await AsyncStorage.getItem('email');
      const res = await axios.post('http://192.168.190.151:5000/submit-update', {
        employeeEmail: email,
        projectName: employeeData?.projectName || '',
        updateLink,
      });

      Alert.alert('Success', res.data.message);
      setUpdateLink('');
      fetchSubmittedUpdates(); // Refresh list
    } catch (err) {
      console.error('Error submitting update:', err);
      Alert.alert('Error', 'Failed to submit update');
    }
  };

  if (!employeeData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading project details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Project</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Project Name:</Text>
        <Text style={styles.value}>{employeeData.projectName || 'Not assigned'}</Text>

        <Text style={styles.label}>Team:</Text>
        <Text style={styles.value}>{employeeData.team || 'N/A'}</Text>

        <Text style={styles.label}>Reporting Manager:</Text>
        <Text style={styles.value}>{employeeData.reportingManager || 'N/A'}</Text>
      </View>

      <Text style={styles.header}>Submit Project Update</Text>
      <TextInput
        placeholder="Enter update link"
        style={styles.input}
        value={updateLink}
        onChangeText={setUpdateLink}
      />
      <Button title="Submit Update" onPress={handleSubmitUpdate} />

      <Text style={styles.header}>Submitted Updates</Text>
      {submittedUpdates.length === 0 ? (
        <Text style={styles.noUpdateText}>No updates submitted yet.</Text>
      ) : (
        submittedUpdates.map((update, index) => (
          <View key={index} style={styles.updateItem}>
            <Text style={styles.updateText}>🔗 {update.updateLink}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: { fontWeight: 'bold' },
  value: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  updateItem: {
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 4,
  },
  updateText: { color: '#007acc' },
  noUpdateText: { color: '#666', fontStyle: 'italic' },
  loadingText: { textAlign: 'center', marginTop: 50 },
});
