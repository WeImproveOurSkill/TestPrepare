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
  const styles = styling(theme);
  const isTablet = useTablet();

  return (
    <View style={styles.container}>
      <Header />
      <Tab.Navigator
        screenOptions={{
          tabBarPosition: isTablet ? 'left' : 'bottom',
          tabBarStyle: {
            width: isTablet ? 300 : undefined,
            minWidth: 250,
            minHeight: 68,
            backgroundColor: colors[theme].WHITE,
            borderTopWidth: 0.5,
            borderColor: colors[theme].GRAY_600,
          },
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarInactiveTintColor: colors[theme].GRAY_600,
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

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  tabBarLabel: {
    fontSize: '16@mvs0.3',
    fontWeight: 'bold',
  },
});

export default MainTabNavigator;
