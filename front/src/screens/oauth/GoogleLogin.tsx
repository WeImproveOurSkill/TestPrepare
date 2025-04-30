import React from 'react';
import { Text, Pressable } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useMutation } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { setEncryptStorage, JwtKey, UserKey } from '../../util/encryptStorage';
import Config from 'react-native-config';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { fetchPost } from '../../util/api';
import { LoginUserResponse } from './AuthHomeScreen';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
  iosClientId: Config.IOS_CLIENT_ID,
  offlineAccess: false,
});

type GoogleLoginProps = {
  onLoginSuccess?: () => void;
};

interface GoogleLoginResponse {
  tokens: {
    accessToken: string;
    idToken: string;
  };
}

function GoogleLogin(
  { onLoginSuccess }: GoogleLoginProps
) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

    // 구글 로그인 정보를 백엔드로 전송하는 mutation
    const { mutate: sendTokensToBackend } = useMutation<LoginUserResponse, Error, GoogleLoginResponse>({
      mutationFn: async (loginData: GoogleLoginResponse) => {
        const result = await fetchPost<LoginUserResponse>('oauth/callback/google', loginData.tokens);
        if (!result) {
          throw new Error('로그인 응답이 없습니다.');
        }
        return result;
      },
      onSuccess: async (data) => {
        console.log('구글 로그인 성공');
        if (data.token) {
          await setEncryptStorage(JwtKey, data.token);
          await setEncryptStorage(UserKey, data.user);
          onLoginSuccess?.();
        }
      },
      onError: () => {
        console.log('구글 로그인 실패');
      },
    });

  // 구글 로그인 mutation
  const { mutate: handleGoogleLogin } = useMutation<GoogleLoginResponse, Error>({
    mutationFn: async () => {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      return {
        userInfo,
        tokens,
      };
    },
    onSuccess: (loginData) => {
      console.log('구글 로그인 성공');
      sendTokensToBackend(loginData);
    },
    onError: () => {
      console.log('구글 로그인 실패');
    },
  });

  return (
   <Pressable
      style={({pressed}) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => handleGoogleLogin()}
    >
      <Text style={styles.buttonText}>구글 계정으로 계속하기</Text>
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
    backgroundColor: colors[theme].UNCHANGE_WHITE,
    borderWidth: 1,
    borderColor: colors[theme].GRAY_250,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: '16@ms0.2',
    fontWeight: '500',
  },
});

export default GoogleLogin;
