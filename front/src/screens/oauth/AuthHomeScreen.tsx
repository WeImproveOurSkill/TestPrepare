import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { authNavigation } from '../../constants';

export type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

function AuthHomeScreen({navigation}:AuthHomeScreenProps) {

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color: '#4A6FFF',
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
    maxWidth: 480,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  nonLoginButton: {
    padding: 10,
  },
  nonLoginButtonPressed: {
    opacity: 0.6,
  },
  nonLoginButtonText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default AuthHomeScreen;
