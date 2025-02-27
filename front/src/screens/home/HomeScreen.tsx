import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StackScreenProps } from '@react-navigation/stack';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import BookView from './components/BookView';
import { authNavigation } from '../../constants';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';

type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

const HomeScreen = ({navigation}:AuthHomeScreenProps) => {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const isTablet = DeviceInfo.isTablet();
  const { width } = useWindowDimensions();

  const handleSelectLicense = () => {
    navigation.navigate(authNavigation.AUTH_HOME);
  };

  const title = 'electricity';
  // 홈스크린에서 certificationId를 이용하여 자격증 안에 있는 과목을 전부 조회
  // 조회를 하게 되면 과목 고유 ID(subjectId: Long), 과목 이름(subjectName: String)이 나오게 되고 과목 고유 ID(subjectId)를 통해 문제를 조회하여 사용자에게 보여줌

  return (
    <View style={styles.container}>
        <View style={isTablet && width >= 600 ? styles.tabletContainer : styles.container}>
          <View style={styles.testLayout}>
          {title ? (
            <BookView title={title} coverColor={title} navigation={navigation} />
          ) : (
            <Pressable style={styles.loadingText} onPress={handleSelectLicense}>
              <Text>자격증을 선택해주세요</Text>
            </Pressable>
          )}
          </View>
        </View>
    </View>
  );
};

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors[theme].WHITE,
  },
  tabletContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  testLayout: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  loadingText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
