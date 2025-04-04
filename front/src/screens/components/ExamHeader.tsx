import React from 'react';
import {View, Pressable} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';


function ExamHeader() {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeStore();
  const styles = styling(theme, insets);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerButtonContainer}>
            <Pressable onPress={handleGoBack}>
              <MaterialIcons name="arrow-back-ios" style={styles.icon} />
            </Pressable>
          </View>
          <View style={styles.headerButtonContainer}>
            <MaterialCommunityIcons name="comment-question-outline" style={styles.GptIcon} />
            <FontAwesomeIcons name="sticky-note-o" style={styles.icon} />
            <MaterialCommunityIcons name="calculator-variant-outline" style={styles.CalculatorIcon} />
          </View>
        </View>
    </View>
  );
}

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  container: {
    paddingTop: insets.top,
    backgroundColor: colors[theme].WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '40@mvs',
    borderBottomColor: colors[theme].GRAY_200,
    borderBottomWidth: 1,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: colors[theme].MAIN,
    fontSize: '24@mvs0.3',
    paddingLeft: '14@ms',
  },
  GptIcon: {
    color: colors[theme].MAIN,
    fontSize: '24@mvs0.3',
    paddingLeft: '14@ms',
    transform: [{ scaleY: 1.1 }],
  },
  CalculatorIcon: {
    color: colors[theme].MAIN,
    fontSize: '30@mvs0.3',
    paddingLeft: '14@ms',
  },
});

export default ExamHeader;
