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
    // 동적 safe area 값은 그대로 사용하고, 추가 오프셋은 스케일링 주석 적용
    paddingTop: insets.top + 10,
    // 세로 패딩은 수직 스케일링 적용(@vs)
    paddingVertical: '10@vs',
    // 가로 패딩은 가로 스케일링 적용(@s)
    paddingHorizontal: '20@ms',
    backgroundColor: colors[theme].WHITE,
    borderBottomColor: colors[theme].GRAY_200,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: '20@ms0.3',
    fontWeight: 'bold',
    color: colors[theme].MAIN,
  },
  loginButton: {
    fontSize: '16@ms0.3',
    color: colors[theme].GRAY_600,
  },
});

export default Header;
