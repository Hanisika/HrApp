import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput, Button,
  TouchableOpacity, Alert, SectionList, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const EmployeeDetails = () => {
  const [employeeSections, setEmployeeSections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isHR, setIsHR] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchEmployee = async () => {
    try {
      const storedHrEmail = await AsyncStorage.getItem('hrEmail');
      console.log("✅ Loaded hrEmail:", storedHrEmail);

      if (!storedHrEmail) {
        setIsHR(false);
        return;
      }

      const res = await axios.post('http://192.168.190.151:5000/get-employee', {
        hrEmail: storedHrEmail,
      });

      if (!res.data.success) {
        setIsHR(false);
        return;
      }

      const grouped = {};
      res.data.employees.forEach(emp => {
        const dept = emp.department || 'Others';
        if (!grouped[dept]) grouped[dept] = [];
        grouped[dept].push(emp);
      });

      const sections = Object.entries(grouped).map(([title, data]) => ({
        title,
        data,
      }));

      setEmployeeSections(sections);
      setIsHR(true);
    } catch (err) {
      console.log("❌ Error fetching employees:", err);
      setIsHR(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const deleteEmployee = async (id) => {
    try {
      const hrEmail = await AsyncStorage.getItem('hrEmail');
      await axios.delete(`http://192.168.190.151:5000/delete-employee/${id}`, {
        params: { hrEmail }
      });
      fetchEmployee();
    } catch (err) {
      console.log("❌ Delete Error:", err);
      Alert.alert("Error deleting employee");
    }
  };

  const openEditform = (emp) => {
    setSelectedEmployee(emp);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const hrEmail = await AsyncStorage.getItem('hrEmail');

      const updateData = {
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone,
        joiningDate: selectedEmployee.joiningDate,
        department: selectedEmployee.department,
        designation: selectedEmployee.designation,
        hrEmail,
      };

      await axios.put(
        `http://192.168.190.151:5000/update-employee/${selectedEmployee._id}`,
        updateData
      );

      setModalVisible(false);
      fetchEmployee();
    } catch (err) {
      console.log("❌ Update Error:", err);
      Alert.alert("Error updating employee");
    }
  };

  // Show message if not HR
  if (!isHR) {
    return (
      <View style={styles.centered}>
        <Text style={styles.messageText}>
          Only HR can view employee details.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={employeeSections}
        keyExtractor={(item) => item._id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.departmentHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.designation}</Text>
            <Text>{new Date(item.joiningDate).toDateString()}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEditform(item)}>
                <Text style={styles.whiteText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteEmployee(item._id)}>
                <Text style={styles.whiteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalView}>
          <Text>Edit Employee</Text>

          <TextInput
            style={styles.input}
            value={selectedEmployee?.name}
            onChangeText={(text) => setSelectedEmployee({ ...selectedEmployee, name: text })}
          />
          <TextInput
            style={styles.input}
            value={selectedEmployee?.email}
            onChangeText={(text) => setSelectedEmployee({ ...selectedEmployee, email: text })}
          />
          <TextInput
            style={styles.input}
            value={selectedEmployee?.phone}
            onChangeText={(text) => setSelectedEmployee({ ...selectedEmployee, phone: text })}
          />

          {/* Date Picker */}
          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                {selectedEmployee?.joiningDate
                  ? new Date(selectedEmployee.joiningDate).toDateString()
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={selectedEmployee?.joiningDate ? new Date(selectedEmployee.joiningDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedEmployee({
                    ...selectedEmployee,
                    joiningDate: date.toISOString(),
                  });
                }
              }}
            />
          )}

          <TextInput
            style={styles.input}
            value={selectedEmployee?.department}
            editable={false}
          />
          <TextInput
            style={styles.input}
            value={selectedEmployee?.designation}
            editable={false}
          />

          <Button title="Update" onPress={handleUpdate} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  whiteText: { color: '#fff', fontWeight: 'bold' },
  modalView: {
    marginTop: '50%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  departmentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});
