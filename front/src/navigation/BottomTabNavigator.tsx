import React from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useThemeStore from '../store/useThemeStore';
import { BottomTabNavigation } from '../constants';
import { colors } from '../constants/colors';
import HomeScreen from '../screens/home/HomeScreen';
import ExamScreen from '../screens/exam/ExamScreen';
import StudyScreen from '../screens/study/StudyScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import Header from '../components/Header';

export type BottomTabParamList = {
  Home: undefined;
  Exam: undefined;
  Study: undefined;
  Quiz: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  const { theme } = useThemeStore();
  const { width } = useWindowDimensions();
  const isTablet =  width >= 600;

  return (
    <View style={styles.container}>
      <Header />
      <Tab.Navigator
      screenOptions={{
        tabBarPosition: isTablet ? 'left' : 'bottom',
        tabBarStyle: {
          width: isTablet ? 300 : undefined,
          minWidth: 250,
          backgroundColor: colors[theme].WHITE,
          borderTopColor: colors[theme].GRAY_300,
        },
        tabBarActiveTintColor: colors[theme].MAIN,
        tabBarInactiveTintColor: colors[theme].GRAY_400,
        headerShown: false,
      }}>
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
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BottomTabNavigator;
