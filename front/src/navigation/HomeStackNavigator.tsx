import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';
import QuestionPagerScreen from '../screens/components/QuestionPagerScreen';
import { QuestionData } from '../screens/components/QuestionItem';

export type HomeStackParamList = {
MainTab: { certifications?: Certification[] } | undefined;
Study: { subjectId: number; subjectName: string };
QuestionPager: {
  questions?: QuestionData[];
  currentPage?: number;
  handlePageChange?: (page: number) => void;
  subjectId?: number;
  subjectName?: string;
  mode: 'study' | 'exam' | 'wrongQuestion' | 'bookmark';
};
};

const Stack = createStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="MainTab" component={MainTabNavigator} />
  <Stack.Screen name="QuestionPager" component={QuestionPagerScreen} />
</Stack.Navigator>
);
}

export default HomeStackNavigator;
