import React, { useState } from 'react';
import { Text, Pressable, Alert, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useMutation } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { setEncryptStorage, AccessKey, UserNameKey, UserProviderKey } from '../../util/encryptStorage';
import Config from 'react-native-config';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { fetchPost } from '../../util/api';
import { LoginUserResponse } from './AuthHomeScreen';
import { useAuthStore } from '../../store/useAuthStore';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
  iosClientId: Config.IOS_CLIENT_ID,
  offlineAccess: true,
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
  const { setLoggedIn } = useAuthStore();
  const [log, setLog] = useState('');

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
        console.log('구글 백엔드 서버 요청 성공');
        console.log(data);
        setLog(prevLog => prevLog + (prevLog ? '\n' : '') + '구글 백엔드 서버 요청 성공');
        await setEncryptStorage(AccessKey, data.token);
        await setEncryptStorage(UserNameKey, data.user.username);
        await setEncryptStorage(UserProviderKey, data.user.provider);
        setLoggedIn(true);
        onLoginSuccess?.();
      },
      onError: (data) => {
        console.log('구글 백엔드 서버 요청 실패');
        console.log(data);
        setLog(prevLog => prevLog + (prevLog ? '\n' : '') + '구글 백엔드 서버 요청 실패' + data);
      },
    });

  // 구글 로그인 mutation
  const { mutate: handleGoogleLogin } = useMutation<GoogleLoginResponse, Error>({
    mutationFn: async () => {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      return {
        tokens,
      };
    },
    onSuccess: (tokens) => {
      setLog(prevLog => prevLog + (prevLog ? '\n' : '') + '구글 서버 요청 성공');
      sendTokensToBackend(tokens);
      console.log(tokens);
      console.log(tokens.tokens.accessToken);
    },
    onError: (data) => {
      console.log('구글 서버 요청 실패');
      console.log(data);
      Alert.alert('구글 로그인 실패', '다시 시도해주세요');
      setLog(prevLog => prevLog + (prevLog ? '\n' : '') + '구글 서버 요청 실패' + data);
    },
  });

  return (
    <View>
   <Pressable
      style={({pressed}) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => handleGoogleLogin()}
    >
      <Text style={styles.buttonText}>구글 계정으로 계속하기</Text>
    </Pressable>
      <Text>{log}</Text>
    </View>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
