import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/oauth/AuthHomeScreen';
import LoginScreen from '../screens/oauth/LoginScreen';
import SelectCertificationScreen from '../screens/selectCertification/SelectCertificationScreen';
import HomeStackNavigator, { HomeStackParamList } from './HomeStackNavigator';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  SelectCertification: undefined;
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SelectCertification" component={SelectCertificationScreen} />
      <Stack.Screen name="HomeStack" component={HomeStackNavigator} />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
