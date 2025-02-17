import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import { BottomTabNavigation } from '../constants';
import ExamScreen from '../screens/exam/ExamScreen';
import StudyScreen from '../screens/study/StudyScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import useThemeStore, { themeMode } from '../store/useThemeStore';
import { colors } from '../constants/colors';

export type BottomTabParamList = {
  Home: undefined;
  Exam: undefined;
  Study: undefined;
  Quiz: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  const { theme } = useThemeStore(); // 현재 테마 가져오기
  const styles = styling(theme); // 테마별 스타일 적용

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, ...styles.tabBarOptions}}>
      <Tab.Screen
        name={BottomTabNavigation.HOME}
        component={HomeScreen}
        />
      <Tab.Screen
        name={BottomTabNavigation.EXAM}
        component={ExamScreen}
        />
      <Tab.Screen
        name={BottomTabNavigation.STUDY}
        component={StudyScreen}
        />
      <Tab.Screen
        name={BottomTabNavigation.QUIZ}
        component={QuizScreen}
        />
    </Tab.Navigator>
  );
}

const styling = (theme: themeMode) => {
  return {
    tabBarOptions: {
      tabBarStyle: {
        backgroundColor: colors[theme].WHITE,
        borderTopColor: colors[theme].GRAY_300,
      },
      tabBarActiveTintColor: colors[theme].MAIN,
      tabBarInactiveTintColor: colors[theme].GRAY_400,
    },
  };
};

export default BottomTabNavigator;
