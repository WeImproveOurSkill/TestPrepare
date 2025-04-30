import React from 'react';
import {View, Pressable, Text} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';

function ExamHeader({}: {}) {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeStore();
  const styles = styling(theme, insets);
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();


  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleReturnToMainTab = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTab' }],
    });
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
            <Pressable onPress={handleReturnToMainTab}>
              <Text style={styles.closeIcon}>X</Text>
            </Pressable>
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
    paddingHorizontal: '20@ms',
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: colors[theme].MAIN,
    fontSize: '24@mvs0.3',
  },
  closeIcon: {
    color: colors[theme].MAIN,
    fontSize: '24@mvs0.3',
  },
});

export default ExamHeader;
