import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import StudyScreen from '../screens/study/StudyScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import ExamScreen from '../screens/exam/ExamScreen';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';

export type HomeStackParamList = {
MainTab: { certifications?: Certification[] } | undefined;
Study: { certificationId: number };
Quiz: { certificationId: number };
Exam: { certificationId: number };
};

const Stack = createStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="MainTab" component={MainTabNavigator} />
  <Stack.Screen name="Study" component={StudyScreen} />
  <Stack.Screen name="Quiz" component={QuizScreen} />
  <Stack.Screen name="Exam" component={ExamScreen} />
</Stack.Navigator>
);
}

export default HomeStackNavigator;
