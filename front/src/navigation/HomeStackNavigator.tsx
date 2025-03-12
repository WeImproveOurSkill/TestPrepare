import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import StudyScreen from '../screens/study/StudyScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import ExamScreen from '../screens/exam/ExamScreen';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';

export type HomeStackParamList = {
  HomeMain: { certifications?: Certification[] } | undefined;
  Study: undefined;
  Quiz: undefined;
  Exam: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Study" component={StudyScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Exam" component={ExamScreen} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
