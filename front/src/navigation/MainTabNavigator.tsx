import React from 'react';
import { View } from 'react-native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScaledSheet } from 'react-native-size-matters';
import { HomeStackParamList } from './HomeStackNavigator';
import useThemeStore, { themeMode } from '../store/useThemeStore';
import { MainTabNavigation } from '../constants/navigations';
import { colors } from '../constants/colors';
import HomeScreen from '../screens/home/HomeScreen';
import WrongQuestionScreen from '../screens/wrongQuestion/WrongQuestionScreen';
import Header from '../screens/components/Header';
import useTablet from '../hooks/useTablet';
import BookmarkScreen from '../screens/bookmark/BookmarkScreen';
import MyPageScreen from '../screens/myPage/MyPageScreen';

export type mainTabParamList = {
  TabHome: NavigatorScreenParams<HomeStackParamList> | undefined;
  WrongQuestionTab: undefined;
  BookmarkTab: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<mainTabParamList>();

function MainTabNavigator() {
  const { theme } = useThemeStore();
  const isTablet = useTablet();
  const styles = styling(theme, isTablet);

  return (
    <View style={styles.container}>
      <Header />
      <Tab.Navigator
        screenOptions={{
          tabBarPosition: isTablet ? 'left' : 'bottom',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        tabBarInactiveTintColor: colors[theme].GRAY_400,
        headerShown: false,
      }}>
        <Tab.Screen
          name={MainTabNavigation.HOME}
          component={HomeScreen}
          options={{ title: '홈' }}
        />
        <Tab.Screen
          name="WrongQuestionTab"
          component={WrongQuestionScreen}
          options={{ title: '오답노트' }}
        />
        <Tab.Screen
          name="BookmarkTab"
          component={BookmarkScreen}
          options={{ title: '북마크' }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{ title: '마이페이지' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styling = (theme: themeMode, isTablet: boolean) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  tabBar: {
    width: isTablet ? 300 : undefined,
    minWidth: 250,
    backgroundColor: colors[theme].WHITE,
    borderTopColor: colors[theme].GRAY_300,
  },
  tabBarLabel: {
    fontSize: '16@ms0.2',
    fontWeight: 'bold',
  },
});

export default MainTabNavigator;
