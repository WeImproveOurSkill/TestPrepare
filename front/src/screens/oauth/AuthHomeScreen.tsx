import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { authNavigation } from '../../constants';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';

export type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

function AuthHomeScreen({navigation}:AuthHomeScreenProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  const isTablet = DeviceInfo.isTablet();

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 처리
  };

  const handleNonLogin = () => {
    // 비로그인 처리
    navigation.navigate(authNavigation.HOME);
  };

  return (
    <SafeAreaView style={[styles.container, isTablet ? styles.tabletContainer : styles.phoneContainer]}>
      <Text style={[styles.title, isTablet ? styles.tabletTitle : styles.phoneTitle]}>
        기사는 한방에 기한82
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            styles.kakaoButton,
            isTablet ? styles.tabletButton : styles.phoneButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleKakaoLogin}
        >
          <Text style={styles.kakaoButtonText}>카카오 계정으로 계속하기</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.button,
            styles.googleButton,
            isTablet ? styles.tabletButton : styles.phoneButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleButtonText}>구글 계정으로 계속하기</Text>
        </Pressable>
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

const styling = (theme: themeMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneContainer: {
    paddingHorizontal: 20,
  },
  tabletContainer: {
    paddingHorizontal: 40,
  },
  title: {
    color: colors[theme].MAIN,
    marginBottom: 40,
    textAlign: 'center',
  },
  phoneTitle: {
    fontSize: 24,
  },
  tabletTitle: {
    fontSize: 32,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneButton: {
    maxWidth: 320,
  },
  tabletButton: {
    maxWidth: 580,
  },
  kakaoButton: {
    backgroundColor: colors[theme].YELLOW_400,
  },
  googleButton: {
    backgroundColor: colors[theme].UNCHANGE_WHITE,
    borderWidth: 1,
    borderColor: colors[theme].GRAY_250,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nonLoginButton: {
    padding: 10,
  },
  nonLoginButtonPressed: {
    opacity: 0.6,
  },
  nonLoginButtonText: {
    fontSize: 14,
    color: colors[theme].GRAY_400,
  },
});

export default AuthHomeScreen;
