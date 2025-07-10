import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/oauth/AuthHomeScreen';
import LoginScreen from '../screens/oauth/LoginScreen';
import SelectCertificationScreen from '../screens/selectCertification/SelectCertificationScreen';
import HomeStackNavigator, { HomeStackParamList } from './HomeStackNavigator';
import { NavigatorScreenParams } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';

export type RootStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  SelectCertification: undefined;
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  const { isLoggedIn } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="HomeStack" component={HomeStackNavigator} />
      ) : (
        <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
      )}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SelectCertification" component={SelectCertificationScreen} />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
