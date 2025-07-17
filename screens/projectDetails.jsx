import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProjectDetails() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [managerEmail, setManagerEmail] = useState('');

  // Load manager email and teams
  useEffect(() => {
    const loadData = async () => {
      const email = await AsyncStorage.getItem('hrEmail'); // manager's login email
      setManagerEmail(email);
      fetchTeams(email);
      fetchAssignments(email);
    };
    loadData();
  }, []);

  const fetchTeams = async (email) => {
    try {
      const res = await axios.get(`http://192.168.190.151:5000/api/teams/manager/${email}`);
      setTeams(res.data.teams);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const fetchAssignments = async (email) => {
    try {
      const res = await axios.get(`http://192.168.190.151:5000/api/projects/assigned/${email}`);
      setAssignments(res.data.assignments);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeamId(teamId);
    const team = teams.find(t => t._id === teamId);
    setEmployees(team?.employees || []);
    setSelectedEmployees([]);
  };

  const toggleEmployee = (empId) => {
    setSelectedEmployees(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const handleAssign = async () => {
    if (!projectName || !selectedTeamId || selectedEmployees.length === 0) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await axios.post(`http://192.168.190.151:5000/api/projects/assign`, {
        projectName,
        description,
        teamId: selectedTeamId,
        employeeIds: selectedEmployees,
        managerEmail
      });

      Alert.alert('Success', 'Project assigned!');
      setProjectName('');
      setDescription('');
      setSelectedTeamId('');
      setEmployees([]);
      setSelectedEmployees([]);
      fetchAssignments(managerEmail);
    } catch (err) {
      console.error('Assignment error:', err);
      Alert.alert('Failed', 'Could not assign project');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Project</Text>

      <TextInput
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
        style={styles.input}
      />

      <TextInput
        placeholder="Project Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text style={styles.subheader}>Select Team</Text>
      {teams.map(team => (
        <TouchableOpacity
          key={team._id}
          onPress={() => handleTeamSelect(team._id)}
          style={[
            styles.teamItem,
            selectedTeamId === team._id && styles.selectedTeam,
          ]}
        >
          <Text style={styles.teamText}>{team.teamName}</Text>
        </TouchableOpacity>
      ))}

      {employees.length > 0 && (
        <>
          <Text style={styles.subheader}>Select Employees</Text>
          {employees.map(emp => (
            <TouchableOpacity
              key={emp._id}
              onPress={() => toggleEmployee(emp._id)}
              style={[
                styles.employeeItem,
                selectedEmployees.includes(emp._id) && styles.selectedEmployee,
              ]}
            >
              <Text>{emp.name}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <Button title="Assign Project" onPress={handleAssign} />

      <Text style={styles.header}>Assigned Projects</Text>
      <FlatList
        data={assignments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.assignmentItem}>
            <Text style={styles.projectTitle}>{item.projectName}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.label}>Team: {item.teamName}</Text>
            <Text style={styles.label}>Employees: {item.employees?.map(e => e.name).join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subheader: { fontSize: 16, fontWeight: '600', marginTop: 16 },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginVertical: 8 },
  teamItem: { padding: 10, backgroundColor: '#dfe6e9', marginVertical: 4, borderRadius: 6 },
  selectedTeam: { backgroundColor: '#81ecec' },
  teamText: { fontSize: 16 },
  employeeItem: { padding: 10, backgroundColor: '#ffeaa7', marginVertical: 4, borderRadius: 6 },
  selectedEmployee: { backgroundColor: '#55efc4' },
  assignmentItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', marginTop: 10 },
  projectTitle: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 14 },
  label: { fontSize: 13, color: '#636e72' },
});
