import React, { useEffect, useState } from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EmployeeForm from './EmployeeForm';
import DashboardContent from './DashboardContent';
import EmployeeDetails from './EmployeeDetails';
import CalendarTab from './Calendar';
import LeaveForm from './LeaveForm';
import ProjectAssignScreen from './projectAssign';
import ProjectDetails from './projectDetails'; // 👈 new
import ProjectStatus from './ProjectStatus';   // 👈 new

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem('role');
        console.log("🎯 Fetched role from AsyncStorage:", savedRole);
        if (savedRole) {
          setRole(savedRole);
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } catch (err) {
        console.error("❌ Error fetching role:", err);
      }
    };

    fetchRole();
  }, []);

  if (!role) return <ActivityIndicator size="large" color="#6c5ce7" />;

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
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
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      >
        {() => <DashboardContent role={role} />}
      </Tab.Screen>

      {role === 'hr' && (
        <>
          <Tab.Screen
            name="Employee Form"
            component={EmployeeForm}
            options={{
              title: 'Add Employee',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-add" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Employee Details"
            component={EmployeeDetails}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" size={size} color={color} />
              ),
            }}
          />
        </>
      )}

      <Tab.Screen
        name="Calendar"
        component={CalendarTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leave Management"
        component={LeaveForm}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />

      {(role === 'hr' || role === 'manager') && (
        <Tab.Screen
          name="Task Assign"
          component={ProjectAssignScreen}
          options={{
            title: 'Assign Tasks',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="send" size={size} color={color} />
            ),
          }}
        />
      )}

      {role === 'manager' && (
        <Tab.Screen
          name="Project Details"
          component={ProjectDetails}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
      )}

      {role === 'employee' && (
        <Tab.Screen
          name="Project Status"
          component={ProjectStatus}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Dashboard;
