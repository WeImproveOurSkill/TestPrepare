import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScaledSheet } from 'react-native-size-matters';
import { HomeStackParamList } from './HomeStackNavigator';
import useThemeStore, { themeMode } from '../store/useThemeStore';
import { BottomTabNavigation } from '../constants';
import { colors } from '../constants/colors';
import HomeScreen from '../screens/home/HomeScreen';
import Header from '../screens/components/Header';

export type mainTabParamList = {
  TabHome: NavigatorScreenParams<HomeStackParamList> | undefined;
  // GPTRecordTab: undefined;
  // BookmarkTab: undefined;
  // MyPage: undefined;
};

const Tab = createBottomTabNavigator<mainTabParamList>();

function MainTabNavigator() {
  const { theme } = useThemeStore();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
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
        name={BottomTabNavigation.HOME}
        component={HomeScreen}
        options={{ title: '홈' }}
      />
      {/* <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{ title: '마이페이지' }}
        /> */}
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
