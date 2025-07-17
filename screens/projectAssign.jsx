import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';


export default function ProjectAssign() {
  const [managerEmail, setManagerEmail] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    const init = async () => {
      const email = await AsyncStorage.getItem('managerEmail');
      setManagerEmail(email);
      fetchTeams(email);
      fetchProjects();
    };
    init();
  }, []);

  const fetchTeams = async (email) => {
    try {
      const res = await axios.get(`http://192.168.190.151:5000/api/teams/manager/${email}`);
      setTeams(res.data.teams);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`http://192.168.190.151:5000/api/projects/dummy`);
      setProjects(res.data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchEmployees = async (teamId) => {
    try {
      const res = await axios.get(`http://192.168.190.151:5000/api/teams/${teamId}/employees`);
      setEmployees(res.data.employees);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleTeamChange = (teamId) => {
    setSelectedTeamId(teamId);
    setSelectedEmployees([]);
    fetchEmployees(teamId);
  };

  const toggleEmployeeSelect = (email) => {
    if (selectedEmployees.includes(email)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e !== email));
    } else {
      setSelectedEmployees([...selectedEmployees, email]);
    }
  };

  const handleAssignProject = async () => {
    if (!selectedProjectId || selectedEmployees.length === 0 || !selectedTeamId) {
      Alert.alert('Missing Info', 'Select team, project, and employees');
      return;
    }

    try {
      await axios.post(`http://192.168.190.151:5000/api/assignments`, {
        managerEmail,
        projectId: selectedProjectId,
        teamId: selectedTeamId,
        employees: selectedEmployees,
      });

      Alert.alert('Success', 'Project assigned successfully!');
      setSelectedEmployees([]);
      setSelectedProjectId('');
    } catch (err) {
      console.error('Error assigning project:', err);
      Alert.alert('Error', 'Could not assign project');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assign Project to Team</Text>

      <Text style={styles.label}>Select Team:</Text>
      <Picker
        selectedValue={selectedTeamId}
        onValueChange={handleTeamChange}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Team --" value="" />
        {teams.map((team) => (
          <Picker.Item key={team._id} label={team.teamName} value={team._id} />
        ))}
      </Picker>

      {employees.length > 0 && (
        <>
          <Text style={styles.label}>Select Employees:</Text>
          <FlatList
            data={employees}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.employeeItem,
                  selectedEmployees.includes(item.email) && styles.selectedEmployee,
                ]}
                onPress={() => toggleEmployeeSelect(item.email)}
              >
                <Text>{item.name} ({item.email})</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <Text style={styles.label}>Select Project:</Text>
      <Picker
        selectedValue={selectedProjectId}
        onValueChange={(value) => setSelectedProjectId(value)}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Project --" value="" />
        {projects.map((proj) => (
          <Picker.Item key={proj._id} label={proj.projectName} value={proj._id} />
        ))}
      </Picker>

      <Button title="Assign Project" onPress={handleAssignProject} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: '600', marginTop: 12 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginVertical: 8 },
  employeeItem: {
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
  },
  selectedEmployee: {
    backgroundColor: '#dfe6e9',
  },
});
