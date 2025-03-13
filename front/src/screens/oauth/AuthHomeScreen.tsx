import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import CustomPagerView from '../components/CustomPagerView';
import LoginScreen from '../login/LoginScreen';
import SelectCertificationScreen from '../selectCertification/SelectCertificationScreen';

function AuthHomeScreen() {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const [currentPage, setCurrentPage] = useState(0);

  const handleLoginSuccess = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handlePageSelected = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <View style={styles.container}>
      <CustomPagerView
        currentPage={currentPage}
        onPageSelected={handlePageSelected}
      >
        <LoginScreen
          key="login"
          onLoginSuccess={handleLoginSuccess}
          // onNonLogin={handleLoginSuccess}
        />
        <SelectCertificationScreen
          key="certification"
        />
      </CustomPagerView>
    </View>
  );
}

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  },
});

export default AuthHomeScreen;
