import React from 'react';
import {View} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatIcon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';


function ExamHeader() {
  const insets = useSafeAreaInsets();
  const {theme} = useThemeStore();
  const styles = styling(theme, insets);

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerButtonContainer}>
            <Icon name="arrow-back-ios" style={styles.icon} />
          </View>
          <View style={styles.headerButtonContainer}>
            <ChatIcon name="chatbox" style={styles.icon} />
            <Icon name="arrow-back-ios" style={styles.icon} />
            <Icon name="arrow-back-ios" style={styles.icon} />
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
    backgroundColor: 'white',
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
});

export default ExamHeader;
