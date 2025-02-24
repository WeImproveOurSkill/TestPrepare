import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { login, getProfile, KakaoProfile, KakaoOAuthToken } from '@react-native-seoul/kakao-login';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DeviceInfo from 'react-native-device-info';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { setEncryptStorage } from '../../util/encryptStorage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Config from 'react-native-config';

type KakaoLoginResponse = {
  token: KakaoOAuthToken;
  profile: KakaoProfile;
  accessToken: string;
}

const KakaoLogin = () => {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const isTablet = DeviceInfo.isTablet();
  const queryClient = useQueryClient();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();


  // 카카오 로그인 정보를 백엔드로 전송하는 mutation
  const { mutate: sendTokensToBackend } = useMutation({
    mutationFn: async (loginData: KakaoLoginResponse) => {
      const response = await fetch(`${Config.BASE_URL}oauth/callback/kakao`, {
        method: 'POST',
        headers: {
          'Authorization' : `Bearer ${loginData.accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      return response.json();
    },
    onSuccess: async (data) => {
      console.log(data);

      if (data.token) {
        await setEncryptStorage('user_jwt', data.token);
        queryClient.setQueryData(['user'], data.user);
        navigation.navigate('Home');
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'Home' }],
        // });
      }
    },
    onError: (error) => {
      console.log('Login error:', error);
    },
  });
  console.log(Config.BASE_URL);

  // 카카오 로그인 mutation
  const { mutate: handleKakaoLogin } = useMutation<KakaoLoginResponse, Error>({
    mutationFn: async () => {
      const token = await login();
      const profile = await getProfile();
      const accessToken = token.accessToken;

      return {
        token,
        profile,
        accessToken,
      };
    },
    onSuccess: (loginData) => {
      console.log('Kakao login success:', loginData);
      sendTokensToBackend(loginData);
    },
    onError: (error) => {
      console.error('Kakao login failed:', error);
    },
  });


  return (
            <Pressable
              style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
                isTablet ? styles.tabletButton : styles.phoneButton,
              ]}
              onPress={() => handleKakaoLogin()}
            >
              <Text style={isTablet ? styles.tabletButtonText : styles.phoneButtonText}>카카오 계정으로 계속하기</Text>
            </Pressable>
  );
};

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

export default KakaoLogin;

