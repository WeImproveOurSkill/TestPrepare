import React from 'react';
import {View, Text} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import useThemeStore, { themeMode } from '../../store/useThemeStore';

interface StudyScreenProps {

}

function StudyScreen({}: StudyScreenProps) {
  const isTablet = DeviceInfo.isTablet();
  const insets = useSafeAreaInsets();
  // const {theme} = useThemeStore();
  const styles = styling();

  return (
   <View style={[styles.container, {
           paddingTop: insets.top,
           paddingLeft: insets.left,
           paddingRight: insets.right,
           ...(!isTablet && {paddingBottom: insets.bottom}),
         }]}><Text>Study</Text></View>
  );
}

const styling = () => ScaledSheet.create({
  container: {
    flex:1,
  },
});

export default StudyScreen;
