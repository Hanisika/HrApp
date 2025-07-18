import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

export default function ProjectAssign() {
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [team, setTeam] = useState('');
  const [reportingManager, setReportingManager] = useState('');

  const handleAssign = async () => {
    if (!employeeEmail || !projectName || !team || !reportingManager) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await axios.put('http://192.168.190.151:5000/assign-project', {
        employeeEmail,
        projectName,
        team,
        reportingManager,
      });

      if (response.data.success) {
        Alert.alert('✅ Success', 'Project assigned successfully');
        setEmployeeEmail('');
        setProjectName('');
        setTeam('');
        setReportingManager('');
      } else {
        Alert.alert('❌ Failed', response.data.message || 'Could not assign project');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Employee Email</Text>
      <TextInput
        style={styles.input}
        value={employeeEmail}
        onChangeText={setEmployeeEmail}
        placeholder="Enter employee email"
      />

      <Text style={styles.label}>Project Name</Text>
      <TextInput
        style={styles.input}
        value={projectName}
        onChangeText={setProjectName}
        placeholder="Enter project name"
      />

      <Text style={styles.label}>Team</Text>
      <TextInput
        style={styles.input}
        value={team}
        onChangeText={setTeam}
        placeholder="Enter team name"
      />

      <Text style={styles.label}>Reporting Manager</Text>
      <TextInput
        style={styles.input}
        value={reportingManager}
        onChangeText={setReportingManager}
        placeholder="Enter manager name"
      />

      <Button title="Assign Project" onPress={handleAssign} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
  },
});
