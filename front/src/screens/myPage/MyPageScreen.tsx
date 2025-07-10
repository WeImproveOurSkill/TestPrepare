import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useMutation } from '@tanstack/react-query';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { fetchPost, fetchDelete } from '../../util/api';
import { removeEncryptStorage, AccessKey, UserNameKey, UserNicknameKey, CertificationKey } from '../../util/encryptStorage';
import ThemeModal from './components/ThemeModal';
import { useAuthStore } from '../../store/useAuthStore';

type FetchMethod = typeof fetchPost | typeof fetchDelete;

type ApiRequest = {
  url: string;
  method: FetchMethod;
  data?: any;
};

function MyPageScreen() {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setLoggedIn, isLoggedIn } = useAuthStore();

  const apiMutation = useMutation({
    mutationFn: (request: ApiRequest) => {
      return request.method(request.url, request.data);
    },
    onSuccess: () => {
      // 저장소에서 데이터 제거
      removeEncryptStorage(AccessKey);
      removeEncryptStorage(UserNameKey);
      removeEncryptStorage(UserNicknameKey);
      removeEncryptStorage(CertificationKey);

      // 로그인 상태 변경 (이렇게 하면 RootStackNavigator가 자동으로 AuthHome을 렌더링)
      setLoggedIn(false);
    },
    onError: (error) => {
      console.log('로그아웃 실패', error);
    },
  });

  const onLogout = () => {
    if (!isLoggedIn) {
      Alert.alert('알림', '로그인 상태가 아닙니다');
      return;
    }

    Alert.alert('로그아웃', '로그아웃하시겠습니까?', [
      {
        text: '아니오',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '예',
        onPress: () => {
          // 빈 객체라도 body로 전송
          apiMutation.mutate({ url: 'user/logout', method: fetchPost, data: {} });
        },
      },
    ]);
  };

  const onDelete = () => {
    if (!isLoggedIn) {
      Alert.alert('알림', '로그인 상태가 아닙니다');
      return;
    }

    Alert.alert('회원 탈퇴', '정말로 회원을 탈퇴하시겠습니까?', [
      {
        text: '아니오',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '예',
        onPress: () => {
          apiMutation.mutate({ url: 'user', method: fetchDelete });
        },
      },
    ]);
  };

  const onChangeTheme = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.questionList} onPress={onLogout}>
        <View >
          <Text style={styles.questionText}>
            로그아웃
          </Text>
        </View>
      </Pressable>
      <Pressable style={styles.questionList} onPress={onDelete}>
        <View >
          <Text style={styles.questionText}>
            회원 탈퇴
          </Text>
        </View>
      </Pressable>
      <Pressable style={styles.questionList} onPress={onChangeTheme}>
        <View >
          <Text style={styles.questionText}>
            테마 변경
          </Text>
        </View>
      </Pressable>
      <ThemeModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </View>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  questionList: {
    height: '50@mvs',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors[theme].GRAY_300,
  },
  questionText: {
    color: colors[theme].BLACK,
    marginLeft: '16@mvs',
    fontSize: '18@mvs0.2',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPageScreen;
