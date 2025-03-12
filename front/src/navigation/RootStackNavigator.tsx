import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/oauth/AuthHomeScreen';
import LoginScreen from '../screens/login/LoginScreen';
import SelectCertificationScreen from '../screens/selectCertification/SelectCertificationScreen';
import MainTabNavigator from './MainTabNavigator';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';

export type RootStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  SelectCertification: undefined;
  MainTabNavigator: { certifications?: Certification[] } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SelectCertification" component={SelectCertificationScreen} />
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
