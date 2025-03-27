import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import StudyScreen from '../screens/study/StudyScreen';
import ExamScreen from '../screens/exam/ExamScreen';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';

export type HomeStackParamList = {
MainTab: { certifications?: Certification[] } | undefined;
Study: { subjectId: number; subjectName: string };
Exam: { subjectId: number; subjectName: string };
};

const Stack = createStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="MainTab" component={MainTabNavigator} />
  <Stack.Screen name="Study" component={StudyScreen} />
  <Stack.Screen name="Exam" component={ExamScreen} />
</Stack.Navigator>
);
}

export default HomeStackNavigator;
