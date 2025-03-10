// AuthHomeScreen.tsx
import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { authNavigation } from '../../constants';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import CustomPagerView from '../components/CustomPagerView';
import LoginScreen from '../login/LoginScreen';
import SelectCertification, { Certification } from '../selectCertification/SelectCertificationScreen';

export type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

function AuthHomeScreen({ navigation }: AuthHomeScreenProps) {
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

  const handleSelectCertification = useCallback((certification: Certification) => {
    // 자격증 선택 후 홈 화면으로 이동

    // 빈 자격증 객체인 경우 (certificationId가 -1)
    if (certification.certificationId === -1) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: authNavigation.HOME,
            state: {
              routes: [
                {
                  name: 'Home',
                },
              ],
            },
          },
        ],
      });
    } else {
      // 정상적인 자격증 객체인 경우
      // 단일 자격증을 certifications로 전달
      const selectedCertifications = [certification];
      navigation.reset({
        index: 0,
        routes: [
          {
            name: authNavigation.HOME,
            params: { certifications: selectedCertifications },
            state: {
              routes: [
                {
                  name: 'Home',
                  params: { certifications: selectedCertifications },
                },
              ],
            },
          },
        ],
      });
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CustomPagerView
        currentPage={currentPage}
        onPageSelected={handlePageSelected}
      >
        <LoginScreen
          key="login"
          onLoginSuccess={handleLoginSuccess}
          onNonLogin={handleLoginSuccess}
        />
        <SelectCertification
          key="certification"
          onSelectCertification={handleSelectCertification}
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
