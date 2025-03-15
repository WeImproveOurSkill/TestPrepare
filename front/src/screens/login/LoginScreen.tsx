import React from 'react';
import { View, SafeAreaView, Text, Pressable } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStackNavigator';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import KakaoLogin from '../oauth/KakaoLogin';
import { useNavigation } from '@react-navigation/native';
// import GoogleLogin from './GoogleLogin';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  // onNonLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'Login'>['navigation']>();

  const handleSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      navigation.navigate('HomeStack');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        기사는 한방에 기한82
      </Text>
      <View style={styles.buttonContainer}>
        <KakaoLogin onLoginSuccess={handleSuccess} />
        {/* <GoogleLogin onLoginSuccess={onLoginSuccess} /> */}
        <Pressable
          style={({pressed}) => [
            styles.nonLoginButton,
            pressed && styles.nonLoginButtonPressed,
          ]}
          onPress={onLoginSuccess}
        >
          <Text style={styles.nonLoginButtonText}>비로그인으로 이용하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors[theme].MAIN,
    marginBottom: 40,
    textAlign: 'center',
    fontSize: '24@ms0.2',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    gap: 10,
    maxWidth: 600,
  },
  nonLoginButton: {
    padding: 10,
  },
  nonLoginButtonPressed: {
    opacity: 0.6,
  },
  nonLoginButtonText: {
    fontSize: '14@ms0.2',
    color: colors[theme].GRAY_400,
  },
});

export default LoginPage;
