import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface QuizScreenProps {

}

function QuizScreen({}: QuizScreenProps) {
  const isTablet = DeviceInfo.isTablet();

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            ...(!isTablet && {paddingBottom: insets.bottom}),
          }]}><Text>Quiz</Text></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
});

export default QuizScreen;
