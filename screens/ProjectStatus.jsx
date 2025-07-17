import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProjectStatus() {
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [projectUpdates, setProjectUpdates] = useState({});
  const [newUpdateLink, setNewUpdateLink] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const email = await AsyncStorage.getItem('employeeEmail');
      setEmployeeEmail(email);
      fetchAssignedProjects(email);
      fetchUpdateHistory(email);
    };
    fetchData();
  }, []);

  const fetchAssignedProjects = async (email) => {
    try {
      const res = await axios.get(`http://192.168.190.151:5000/api/projects/employee/${email}`);
      setAssignedProjects(res.data.projects);
    } catch (err) {
      console.error('Error fetching assigned projects:', err);
    }
  };

  const fetchUpdateHistory = async (email) => {
    try {
      const res = await axios.get(`http://192.168.190.151:5000/api/updates/${email}`);
      const updates = res.data.updates;

      // Group updates by project ID
      const grouped = {};
      updates.forEach((upd) => {
        if (!grouped[upd.projectId]) grouped[upd.projectId] = [];
        grouped[upd.projectId].push(upd);
      });
      setProjectUpdates(grouped);
    } catch (err) {
      console.error('Error fetching update history:', err);
    }
  };

  const handleSubmitUpdate = async (projectId) => {
    if (!newUpdateLink) {
      Alert.alert('Error', 'Please enter a link');
      return;
    }

    try {
      await axios.post(`http://192.168.190.151:5000/api/updates`, {
        employeeEmail,
        projectId,
        link: newUpdateLink,
      });

      Alert.alert('Success', 'Update submitted!');
      setNewUpdateLink('');
      fetchUpdateHistory(employeeEmail);
    } catch (err) {
      console.error('Error submitting update:', err);
      Alert.alert('Failed', 'Could not submit update');
    }
  };

  const renderProjectItem = ({ item }) => {
    return (
      <View style={styles.projectCard}>
        <Text style={styles.projectTitle}>{item.projectName}</Text>
        <Text style={styles.projectDesc}>{item.description}</Text>

        <TextInput
          placeholder="Paste your update link"
          value={newUpdateLink}
          onChangeText={setNewUpdateLink}
          style={styles.input}
        />
        <Button title="Submit Update" onPress={() => handleSubmitUpdate(item._id)} />

        <Text style={styles.subheader}>Your Previous Updates:</Text>
        {(projectUpdates[item._id] || []).map((u, idx) => (
          <Text key={idx} style={styles.linkText}>🔗 {u.link}</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Project Status</Text>
      <FlatList
        data={assignedProjects}
        keyExtractor={(item) => item._id}
        renderItem={renderProjectItem}
        ListEmptyComponent={<Text>No assigned projects found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  projectCard: {
    backgroundColor: '#f1f2f6',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  projectTitle: { fontSize: 18, fontWeight: '600' },
  projectDesc: { fontSize: 14, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  subheader: { marginTop: 8, fontWeight: '600' },
  linkText: { color: '#0984e3', fontSize: 13, marginVertical: 2 },
});
