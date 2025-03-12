import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../store/useThemeStore';
import { BottomTabNavigation } from '../constants';
import { colors } from '../constants/colors';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';
import HomeStackNavigator from './HomeStackNavigator';

export type BottomTabParamList = {
  TabHome: { certifications?: Certification[] } | undefined;
  // GPTRecordTab: undefined;
  // BookmarkTab: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTabNavigator() {
  const { theme } = useThemeStore();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = styling(theme, isTablet);

  return (
      <Tab.Navigator
      screenOptions={{
        tabBarPosition: isTablet ? 'left' : 'bottom',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors[theme].MAIN,
        tabBarInactiveTintColor: colors[theme].GRAY_400,
        // tabBarActiveBackgroundColor: colors[theme].MAIN,
        headerShown: false,
      }}>
        <Tab.Screen
          name={BottomTabNavigation.HOME}
          component={HomeStackNavigator}
          options={{ title: '홈' }}
          />
        {/* <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{ title: '마이페이지' }}
        /> */}
      </Tab.Navigator>
  );
}

const styling = (theme: themeMode, isTablet: boolean) => ScaledSheet.create({
  tabBar: {
    width: isTablet ? 300 : undefined,
    minWidth: 250,
    backgroundColor: colors[theme].WHITE,
    borderTopColor: colors[theme].GRAY_300,
  },
  tabBarLabel: {
    fontSize: '16@ms0.2',
    fontWeight: 'bold',
    // paddingVertical: '5@ms',
  },
});

export default MainTabNavigator;
