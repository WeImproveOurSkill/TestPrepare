import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import DeviceInfo from 'react-native-device-info';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { authNavigation } from '../../constants';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import KakaoLogin from './KakaoLogin';
import GoogleLogin from './GoogleLogin';


export type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

function AuthHomeScreen({navigation}:AuthHomeScreenProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const isTablet = DeviceInfo.isTablet();

  const handleNonLogin = () => { // 비로그인 처리
    navigation.navigate(authNavigation.HOME);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        기사는 한방에 기한82
      </Text>
      <View style={[styles.buttonContainer, isTablet && styles.tabletButton]}>
        <KakaoLogin />
        <GoogleLogin />
        <Pressable
          style={({pressed}) => [
            styles.nonLoginButton,
            pressed && styles.nonLoginButtonPressed,
          ]}
          onPress={handleNonLogin}
        >
          <Text style={styles.nonLoginButtonText}>비로그인으로 이용하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors[theme].MAIN,
    marginBottom: 40,
    textAlign: 'center',
    fontSize: '24@ms0.2',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    gap: 10,
  },
  tabletButton: {
    maxWidth: 600,
  },
  nonLoginButton: {
    padding: 10,
  },
  nonLoginButtonPressed: {
    opacity: 0.6,
  },
  nonLoginButtonText: {
    fontSize: '14@ms0.2',
    color: colors[theme].GRAY_400,
  },
});

export default AuthHomeScreen;
