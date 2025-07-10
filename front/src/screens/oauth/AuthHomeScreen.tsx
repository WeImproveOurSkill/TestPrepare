import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import CustomPagerView from '../components/CustomPagerView';
import LoginScreen from './LoginScreen';
import SelectCertificationScreen from '../selectCertification/SelectCertificationScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStackNavigator';
import { AccessKey, getEncryptStorage } from '../../util/encryptStorage';
import { useAuthStore } from '../../store/useAuthStore';

export interface LoginUserResponse {
  token: string;
  refresh: string;
  user: {
    nickname: string;
    provider: string;
    username: string;
  }
}

function AuthHomeScreen() {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const [currentPage, setCurrentPage] = useState(0);
  const { isLoggedIn } = useAuthStore();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();

  useEffect(() => {
    const checkJwt = async () => {
      if (!isLoggedIn) {
        return; // 로그아웃 상태면 체크하지 않음
      }

      const jwt = await getEncryptStorage(AccessKey);
      if (jwt) {
        navigation.navigate('HomeStack');
      }
    };

    checkJwt();
  }, [navigation, isLoggedIn]);

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
          onNonLogin={handleLoginSuccess}
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
