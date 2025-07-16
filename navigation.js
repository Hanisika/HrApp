// navigation/index.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginPage from './screens/LoginPage';
import Dashboard from './screens/Dashboard'; // or HRDashboard if you separate roles

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const email = await AsyncStorage.getItem('hrEmail');
      setIsLoggedIn(!!email);
      setInitializing(false);
    };
    checkLogin();
  }, []);

  if (initializing) return null; // wait for login check before rendering anything

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Dashboard" component={Dashboard} />
        ) : (
          <Stack.Screen name="Login" component={LoginPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
