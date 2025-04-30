import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';
import QuestionPagerScreen from '../screens/components/QuestionPagerScreen';
import { QuestionData } from '../screens/components/QuestionItem';
import ExamScreen from '../screens/exam/ExamScreen';
import ExamResultScreen from '../screens/examResult/ExamResultScreen';

export type HomeStackParamList = {
  MainTab: { certifications?: Certification[] } | undefined;
  Exam: { certificationId: number, subjectId: number, subjectName: string };
  QuestionPager: {
    questions?: QuestionData[];
    currentPage?: number;
    handlePageChange?: (page: number) => void;
    subjectId?: number;
    subjectName?: string;
    certificationId?: number;
    mode: 'study' | 'exam' | 'wrongQuestion' | 'bookmark';
    year?: number;
    session?: number;
  };
  ExamResult: {
    userAnswers: { questionId: number; answer: string; userAnswer: string; }[];
    year: number;
    session: number;
  };
};

const Stack = createStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTab" component={MainTabNavigator} />
    <Stack.Screen name="QuestionPager" component={QuestionPagerScreen} />
    <Stack.Screen name="Exam" component={ExamScreen} />
    <Stack.Screen name="ExamResult" component={ExamResultScreen} />
  </Stack.Navigator>
);
}

export default HomeStackNavigator;
