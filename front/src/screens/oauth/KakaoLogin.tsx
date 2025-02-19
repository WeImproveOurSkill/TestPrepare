import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { login, getProfile, KakaoProfile, KakaoOAuthToken, getAccessToken, KakaoAccessTokenInfo } from '@react-native-seoul/kakao-login';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DeviceInfo from 'react-native-device-info';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { setEncryptStorage } from '../../util/encryptStorage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type KakaoLoginResponse = {
  token: KakaoOAuthToken;
  profile: KakaoProfile;
  accessToken: KakaoAccessTokenInfo;
}

const KakaoLogin = () => {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const queryClient = useQueryClient();
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  // 카카오 로그인 정보를 백엔드로 전송하는 mutation
  const { mutate: sendTokensToBackend } = useMutation({
    mutationFn: async (loginData: KakaoLoginResponse) => {
      const response = await fetch('https://localhost:8080/oauth/callback/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Failed to send tokens to backend');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      if (data.jwtToken) {
        await setEncryptStorage('user_jwt', data.jwtToken);
        queryClient.setQueryData(['user'], data.user);
        navigation.navigate('Home');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
  // console.log(sendTokensToBackend);


  // 카카오 로그인 mutation
  const { mutate: handleKakaoLogin } = useMutation<KakaoLoginResponse, Error>({
    mutationFn: async () => {
      const token = await login();
      const profile = await getProfile();
      const accessToken = await getAccessToken();

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

  // const sendTokensToBackend = async (token: KakaoOAuthToken, accessToken: KakaoAccessTokenInfo, profile: KakaoProfile) => {
  //   try {
  //     const response = await fetch('https://localhost:8080/oauth/callback/kakao', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         token,
  //         accessToken,
  //         profile,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log('Backend response:', data);
  //       if (data.jwtToken) {
  //         await setEncryptStorage('userJwt', data.jwtToken);
  //       }
  //     } else {
  //       console.error('Failed to send tokens to backend:', data);
  //     }
  //   } catch (error) {
  //     console.error('Error sending tokens to backend:', error);
  //   }
  // };

  // const handleKakaoLogin = async () => {
  //   try {
  //     const token = await login();
  //     const profile = await getProfile();
  //     const accessToken = await getAccessToken();

  //     console.log('login: ', token);
  //     console.log('Access Token:', accessToken);
  //     console.log('Profile: ', profile);

  //     // 백엔드로 토큰 전달
  //     await sendTokensToBackend(token, accessToken, profile);
  //     navigation.navigate('Home');
  //   } catch (error) {
  //     console.log('Kakao login failed:', error);
  //   }
  // };

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

