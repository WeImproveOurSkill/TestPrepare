import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import CustomPagerView from '../components/CustomPagerView';
import LoginScreen from '../login/LoginScreen';
import SelectCertificationScreen from '../selectCertification/SelectCertificationScreen';
// import { getEncryptStorage, JwtKey } from '../../util/encryptStorage';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootStackNavigator';

function AuthHomeScreen() {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const [currentPage, setCurrentPage] = useState(0);

  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();

  // useEffect(() => {
  //   const checkJwt = async () => {
  //     try {
  //       const jwt = await getEncryptStorage(JwtKey);
  //       console.log('jwt', jwt);
  //       if (jwt) {
  //         // 토큰이 있으면 바로 홈 화면으로 이동
  //         // certifications 요청은 해당 화면에서 자동으로 이루어짐
  //         navigation.navigate('HomeStack');
  //         // certifications 요청이 실패하면 해당 화면의 오류 처리에서
  //         // 토큰 관련 오류 처리가 자동으로 이루어질 것임
  //       }
  //     } catch (error) {
  //       console.error('토큰 확인 오류:', error);
  //     }
  //   };

  //   checkJwt();
  // }, [navigation]);

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
