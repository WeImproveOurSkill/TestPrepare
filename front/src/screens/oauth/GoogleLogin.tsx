import React from 'react';
import { Text, Pressable } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
  offlineAccess: true,
  iosClientId: Config.IOS_CLIENT_ID,
});

// type GoogleLoginProps = {
//   onLoginSuccess?: () => void;
// };

function GoogleLogin(
  // { onLoginSuccess }: GoogleLoginProps
) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  const handleGoogleLogin = async () => {
    // try {
    //   await GoogleSignin.hasPlayServices();
      // const userInfo = await GoogleSignin.signIn();
      // const tokens = await GoogleSignin.getTokens();

    //   if (tokens.idToken) {
        // 백엔드로 토큰 전송
    //     const response = await fetch(`${Config.BASE_URL}oauth/callback/google`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ token: tokens.idToken }),
    //     });

    //     // 로그인 처리
    //   }
    // } catch (error) {
    //   console.log(error);
    //   // if (isErrorWithCode(error)) {
    //   //   switch (error.code) {
    //   //     case statusCodes.SIGN_IN_CANCELLED:
    //   //       console.log('로그인이 취소되었습니다');
    //   //       break;
    //   //     case statusCodes.IN_PROGRESS:
    //   //       console.log('로그인이 이미 진행중입니다');
    //   //       break;
    //   //     case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
    //   //       console.log('Play Services가 사용할 수 없습니다');
    //   //       break;
    //   //     default:
    //   //       console.error('기타 에러:', error);
    //   //   }
    //   // }
    // }
     // 로그인 성공 후
  //    onLoginSuccess?.();
  //   } catch (error) {
  //     console.error('Google Login Error:', error);
  //   }
  };

  return (
   <Pressable
      style={({pressed}) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={handleGoogleLogin}
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
