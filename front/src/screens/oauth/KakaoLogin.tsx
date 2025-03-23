import React from 'react';
import { Pressable, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { login, getProfile, KakaoProfile, KakaoOAuthToken } from '@react-native-seoul/kakao-login';
import { useMutation } from '@tanstack/react-query';
import { setEncryptStorage } from '../../util/encryptStorage';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { fetchPost } from '../../util/api';
import { LoginUserResponse } from './GoogleLogin';

type KakaoLoginResponse = {
  token: KakaoOAuthToken;
  profile: KakaoProfile;
  accessToken: string;
}

type KakaoLoginProps = {
  onLoginSuccess?: () => void;
};

function KakaoLogin({ onLoginSuccess }: KakaoLoginProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);


  // 카카오 로그인 정보를 백엔드로 전송하는 mutation
  const { mutate: sendTokensToBackend } = useMutation<LoginUserResponse, Error, KakaoLoginResponse>({
    mutationFn: async (loginData: KakaoLoginResponse) => {
      return await fetchPost('oauth/callback/kakao', loginData);
    },
    onSuccess: async (data) => {
      console.log(data);
      onLoginSuccess?.();

      if (data.accessToken) {
        await setEncryptStorage('user_jwt', data.accessToken);
        await setEncryptStorage('user', data.userName);
      }
    },
    onError: (error) => {
      console.log('Login error:', error);
    },
  });

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
      ]}
      onPress={() => handleKakaoLogin()}
    >
      <Text style={styles.buttonText}>카카오 계정으로 계속하기</Text>
    </Pressable>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({

  button: {
    width: '100%',
    padding: '15@ms0.3',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors[theme].YELLOW_400,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: '16@ms0.2',
    fontWeight: '500',
  },
});

export default KakaoLogin;

