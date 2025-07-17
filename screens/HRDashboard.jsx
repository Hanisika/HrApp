import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import DashboardContent from './DashboardContent';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import ProjectAssign from './projectAssign';
import CalendarTab from './Calendar';
import LeaveForm from './LeaveForm';
import ProjectDetails from './projectDetails'; // ✅ Import your ProjectDetails screen

const Tab = createBottomTabNavigator();

export default function HRDashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        console.log('🎯 Fetched role:', storedRole);

        if (!storedRole || storedRole !== 'hr') {
          console.warn('⚠️ Not HR, redirecting...');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          setRole(storedRole);
        }
      } catch (err) {
        console.error('AsyncStorage error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

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
        name="Dashboard"
        component={DashboardContent}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddEmployee"
        component={EmployeeForm}
        options={{
          title: 'Add Employee',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Employees"
        component={EmployeeDetails}
        options={{
          title: 'All Employees',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProjectAssign"
        component={ProjectAssign}
        options={{
          title: 'Assign Projects',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProjectDetails"
        component={ProjectDetails}
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarTab}
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LeaveForm"
        component={LeaveForm}
        options={{
          title: 'Leave Mgmt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
