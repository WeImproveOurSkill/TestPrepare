import React from 'react';
import { Text, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';


function Header() {
  const { theme } = useThemeStore(); // 현재 테마 가져오기
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets); // 테마별 스타일 적용

  return (
      <View style={[styles.header]}>
        <Text style={styles.title}>기한82</Text>
        <Text style={styles.loginButton}>로그인</Text>
      </View>
  );
}

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: insets.top + 10,
    paddingVertical: '10@vs',
    paddingHorizontal: '20@ms',
    backgroundColor: colors[theme].WHITE,
    borderBottomColor: colors[theme].GRAY_200,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: '20@ms0.3',
    fontWeight: '600',
    color: colors[theme].MAIN,
  },
  loginButton: {
    fontSize: '16@ms0.3',
    color: colors[theme].GRAY_600,
  },
});

export default Header;
