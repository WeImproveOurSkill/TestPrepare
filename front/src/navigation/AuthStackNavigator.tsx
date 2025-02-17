import React from 'react';
import { authNavigation } from '../constants';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/oauth/AuthHomeScreen';
import BottomTabNavigator from './BottomTabNavigator';


export type AuthStackParamList = {
  AuthHome: undefined;
  Home: undefined;
  Exam: undefined;
  Study: undefined;
  Quiz: undefined;
}

const Stack = createStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={authNavigation.AUTH_HOME}
        component={AuthHomeScreen}
        />
      <Stack.Screen
        name={authNavigation.HOME}
        component={BottomTabNavigator}
        />
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;
