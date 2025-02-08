import React from 'react';
import { authNavigation } from '../constants';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/AuthHomeScreen';
// import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';


export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  Home: undefined;
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
        component={HomeScreen}
        />
        {/* <Stack.Screen
        name={authNavigation.LOGIN}
        component={LoginScreen}
        /> */}
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;
