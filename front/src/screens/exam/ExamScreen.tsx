import React from 'react';
import {Text, View} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTablet from '../../hooks/useTablet';
// import useThemeStore, { themeMode } from '../../store/useThemeStore';


function ExamScreen() {
  const isTablet = useTablet();
  // const {theme} = useThemeStore();
  const styles = styling();

  const insets = useSafeAreaInsets();
  return (
   <View style={[styles.container, {
           paddingTop: insets.top,
           paddingLeft: insets.left,
           paddingRight: insets.right,
           ...(!isTablet && {paddingBottom: insets.bottom}),
         }]}><Text>Exam</Text></View>
  );
}

const styling = () => ScaledSheet.create({
  container: {
    flex:1,
  },
});

export default ExamScreen;
