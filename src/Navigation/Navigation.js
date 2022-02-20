import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/LoginScreen'
import SignupScreen from '../screens/Signup/SignupScreen'
import DashboardScreen from '../screens/Dashboard/DashboardScreen'
import TransferScreen from '../screens/Transfer/TransferScreen'

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={SignupScreen} />
        <Stack.Screen name='Dashboard' component={DashboardScreen} />
        <Stack.Screen name='Transfer' component={TransferScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
