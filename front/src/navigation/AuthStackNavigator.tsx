import React from 'react';
import { authNavigation } from '../constants';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/oauth/AuthHomeScreen';
import examScreen from '../screens/exam/ExamScreen';
import StudyScreen from '../screens/study/StudyScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import BottomTabNavigator from './BottomTabNavigator';


export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  Home: undefined;
  Exam: undefined;
  Study: undefined;
  Quiz: undefined;
  BottomTabNavigator: undefined;
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
      <Stack.Screen
        name={authNavigation.EXAM}
        component={examScreen}
        />
      <Stack.Screen
        name={authNavigation.STUDY}
        component={StudyScreen}
        />
      <Stack.Screen
        name={authNavigation.QUIZ}
        component={QuizScreen}
        />
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;
