import React from 'react';
import { View, Text} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface QuizScreenProps {

}

function QuizScreen({}: QuizScreenProps) {
  const isTablet = DeviceInfo.isTablet();
  const styles = styling();

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

const styling = () => ScaledSheet.create({

  container: {
    flex:1,
  },
});

export default QuizScreen;
