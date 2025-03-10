import React from 'react';
import { authNavigation } from '../constants';
import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/oauth/AuthHomeScreen';
import examScreen from '../screens/exam/ExamScreen';
import StudyScreen from '../screens/study/StudyScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SelectCertificationScreen, { Certification } from '../screens/selectCertification/SelectCertificationScreen';

export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  Home: { certifications?: Certification | Certification[] } | undefined;
  Exam: undefined;
  Study: undefined;
  Quiz: undefined;
  BottomTabNavigator: { certifications?: Certification | Certification[] };
  SelectCertification: undefined;
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
      <Stack.Screen
        name={authNavigation.SELECT_CERTIFICATION}
        component={SelectCertificationScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;
