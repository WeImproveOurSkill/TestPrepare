import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  login, // logout, getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import DeviceInfo from 'react-native-device-info';
// import { useNavigation } from '@react-navigation/native';
// import { AuthStackParamList } from '../../navigation/AuthStackNavigator';

const KakaoLogin = () => {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  const isTablet = DeviceInfo.isTablet();
  // const navigation = useNavigation<AuthStackParamList>();

  const sendTokensToBackend = async (accessToken: string, refreshToken: string) => {
    try {
      const response = await fetch('https://localhost:8080/oauth/kakao/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Backend response:', data);
      } else {
        console.error('Failed to send tokens to backend:', data);
      }
    } catch (error) {
      console.error('Error sending tokens to backend:', error);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const result = await login();
      const accessToken = result.accessToken; // 카카오에서 받은 access token
      const refreshToken = result.refreshToken; // 카카오에서 받은 refresh token

      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);

      // 백엔드로 토큰 전달
      await sendTokensToBackend(accessToken, refreshToken);
      // navigation.Home;
    } catch (error) {
      console.error('Kakao login failed:', error);
    }
  };

  return (
            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                isTablet ? styles.tabletButton : styles.phoneButton,
              ]}
              onPress={handleKakaoLogin}
            >
              <Text style={isTablet ? styles.tabletButtonText : styles.phoneButtonText}>카카오 계정으로 계속하기</Text>
            </Pressable>
  );
};

export default KakaoLogin;

const styling = (theme: themeMode) => StyleSheet.create({
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
    backgroundColor: colors[theme].YELLOW_400,
  },
  phoneButton: {
    padding: 16,
  },
  tabletButton: {
    padding: 20,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  phoneButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tabletButtonText: {
    fontSize: 20,
    fontWeight: '500',
  },
});
