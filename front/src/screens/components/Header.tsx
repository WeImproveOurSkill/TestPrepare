import React, { useState, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { getEncryptStorage, UserKey } from '../../util/encryptStorage';
import { RootStackParamList } from '../../navigation/RootStackNavigator';


function Header() {
  const { theme } = useThemeStore(); // 현재 테마 가져오기
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets); // 테마별 스타일 적용
  const [userName, setUserName] = useState<string | null>(null); // 사용자 이름을 저장할 상태 변수
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  async function fetchUserName() {
    try {
      const data = await getEncryptStorage(UserKey);

      if (data && data.username) {
        const originalName = data.username;
        // '_'가 포함되어 있는지 확인하고, 포함되어 있다면 '_' 앞부분만 사용
        const processedName = originalName.includes('_')
          ? originalName.split('_')[0]
          : originalName;
        setUserName(processedName);
      } else {
        setUserName(''); // 예: 빈 문자열로 설정
      }
    } catch (error) {
      setUserName(''); // 오류 발생 시 빈 문자열 설정
    }
  }

  useEffect(() => {
    fetchUserName();
  }, []);

  const backToLoginScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthHome' }],
    });
  };

  return (
      <View style={[styles.header]}>
        <Text style={styles.title}>기한82</Text>
        {userName === '' ? (
          <Pressable onPress={backToLoginScreen}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
        ) : (
            <Text style={styles.loginButtonText}>{userName}님</Text>
        )}
      </View>
  );
}

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: insets.top + 10,
    paddingVertical: '10@vs',
    paddingHorizontal: '20@ms',
    backgroundColor: colors[theme].WHITE,
    borderBottomColor: colors[theme].GRAY_400,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: '20@ms0.3',
    fontWeight: '600',
    color: colors[theme].MAIN,
  },
  loginButtonText: {
    fontSize: '20@ms0.3',
    color: colors[theme].GRAY_600,
  },
});

export default Header;
