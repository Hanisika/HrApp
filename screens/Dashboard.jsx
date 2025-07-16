import React from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EmployeeForm from './EmployeeForm';
import DashboardContent from './DashboardContent';
import EmployeeDetails from './EmployeeDetails';
import CalendarTab from './Calendar';
import LeaveForm from './LeaveForm';
import AssignTaskScreen from './AssignTaskManagement';
import TaskAssignScreen from './AssignTaskManagement';

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const role = route?.params?.role;

  console.log("📦 Received role in Dashboard using useRoute:", role);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' },params={role}],
            });
          },
        },
      ]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6c5ce7' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#6c5ce7',
        tabBarInactiveTintColor: '#b2bec3',
        tabBarLabelStyle: { fontSize: 14 },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="Dashboard Content"
        component={DashboardContent}
        initialParams={{ role }}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Employee Form"
        component={EmployeeForm}
        options={{
          title: 'Add Employee',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Employee Details"
        component={EmployeeDetails}
        options={{
          title: 'Employee Details',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarTab}
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leave Management"
        component={LeaveForm}
        options={{
          title: 'Leave Management',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
       <Tab.Screen
        name="Task Management"
        component={TaskAssignScreen}
        options={{
          title: 'Task Management',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="send" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Dashboard;
