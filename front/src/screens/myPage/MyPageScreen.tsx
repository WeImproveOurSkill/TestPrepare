import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { fetchPost, fetchDelete } from '../../util/api';
import { RootStackParamList } from '../../navigation/RootStackNavigator';
import { removeEncryptStorage, JwtKey, UserKey } from '../../util/encryptStorage';
import ThemeModal from './components/ThemeModal';

type FetchMethod = typeof fetchPost | typeof fetchDelete;

type ApiRequest = {
  url: string;
  method: FetchMethod;
};

interface MyPageScreenProps {

}

function MyPageScreen({}: MyPageScreenProps) {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const apiMutation = useMutation({
    mutationFn: (request: ApiRequest) => {
      return request.method(request.url, {});
    },
    onSuccess: () => {
      removeEncryptStorage(JwtKey);
      removeEncryptStorage(UserKey);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthHome' }],
      });
    },
    onError: () => {
    },
  });

  const onLogout = () => {
    Alert.alert('로그아웃', '로그아웃하시겠습니까?', [
      {
        text: '아니오',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '예',
        onPress: () => {
          apiMutation.mutate({ url: 'user/logout', method: fetchPost });
        },
      },
    ]);
  };

  const onDelete = () => {
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
