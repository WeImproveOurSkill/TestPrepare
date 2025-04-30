import React from 'react';
import { Pressable, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { login, KakaoOAuthToken } from '@react-native-seoul/kakao-login';
import { useMutation } from '@tanstack/react-query';
import { setEncryptStorage, JwtKey, UserKey } from '../../util/encryptStorage';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { fetchPost } from '../../util/api';
import { LoginUserResponse } from './AuthHomeScreen';

interface Props {
  onLoginSuccess?: () => void;
}

function KakaoLogin({ onLoginSuccess }: Props) {
  const {theme} = useThemeStore();
  const styles = styling(theme);


  // 카카오 로그인 정보를 백엔드로 전송하는 mutation
  const { mutate: sendTokensToBackend } = useMutation<LoginUserResponse, Error, KakaoOAuthToken>({
    mutationFn: async (loginData: KakaoOAuthToken) => {
      const result = await fetchPost<LoginUserResponse>('oauth/callback/kakao', loginData);
      if (!result) {
        throw new Error('로그인 응답이 없습니다.');
      }
      return result;
    },
    onSuccess: async (data) => {
      onLoginSuccess?.();

      if (data.token) {
        console.log('Login successful:', data);
        await setEncryptStorage(JwtKey, data.token);
        await setEncryptStorage(UserKey, data.user);
      }
    },
  });

  // 카카오 로그인 mutation
  const { mutate: handleKakaoLogin } = useMutation<KakaoOAuthToken, Error>({
    mutationFn: async () => {
      const token = await login();
      return token;
    },
    onSuccess: (loginData) => {
      sendTokensToBackend(loginData);
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

