import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginPage from './screens/LoginPage';
import Dashboard from './screens/Dashboard';
import HRDashboard from './screens/HRDashboard';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const determineInitialRoute = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role === 'hr') {
        setInitialRoute('HRDashboard');
      } else if (role === 'manager' || role === 'employee') {
        setInitialRoute('Dashboard');
      } else {
        setInitialRoute('Login');
      }
    };
    determineInitialRoute();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="HRDashboard" component={HRDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
