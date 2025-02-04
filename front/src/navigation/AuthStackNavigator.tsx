import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/AuthHomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { authNavigation } from '../constants';


export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
}

function AuthStackNavigator() {

  const Stack = createStackNavigator<AuthStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen name={authNavigation.AUTH_HOME} component={AuthHomeScreen}/>
      <Stack.Screen name={authNavigation.LOGIN} component={LoginScreen}/>
    </Stack.Navigator>
  );
}

// const styles = StyleSheet.create({});

export default AuthStackNavigator;
