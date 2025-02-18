import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookView from './components/BookView';
import { authNavigation } from '../../constants';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';

type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

const HomeScreen = ({navigation}:AuthHomeScreenProps) => {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const isTablet = DeviceInfo.isTablet();

  const insets = useSafeAreaInsets();

  const handleSelectLicense = () => {
    navigation.navigate(authNavigation.AUTH_HOME);
  };

  const title = 'electricity';
  // 홈스크린에서 certificationId를 이용하여 자격증 안에 있는 과목을 전부 조회
  // 조회를 하게 되면 과목 고유 ID(subjectId: Long), 과목 이름(subjectName: String)이 나오게 되고 과목 고유 ID(subjectId)를 통해 문제를 조회하여 사용자에게 보여줌

  return (
    <View style={[styles.container, {
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }]}>
        <View style={styles.header}>
          <Text style={styles.title}>기한82</Text>
          <Text style={styles.loginButton}>로그인</Text>
        </View>
        <View style={!isTablet ? styles.container : styles.tabletContainer}>
          <View style={styles.testLayout}>
          {title ? (
            <BookView title={title} coverColor={title} navigation={navigation} />
          ) : (
            <Pressable style={styles.loadingText} onPress={handleSelectLicense}>
              <Text>자격증을 선택해주세요</Text>
            </Pressable>
          )}
          </View>
            {/* <View style={ !isTablet && styles.bottomNav }>
              <Pressable style={ !isTablet ? styles.navItem : styles.navItemTablet }>
                <Text style={styles.navText}>홈</Text>
              </Pressable>
              <Pressable style={ !isTablet ? styles.navItem : styles.navItemTablet }>
                <Text style={styles.navText}>GPT 기록</Text>
              </Pressable>
              <Pressable style={ !isTablet ? styles.navItem : styles.navItemTablet }>
                <Text style={styles.navText}>오답노트</Text>
              </Pressable>
              <Pressable style={ !isTablet ? styles.navItem : styles.navItemTablet }>
                <Text style={styles.navText}>마이페이지</Text>
              </Pressable>
            </View> */}
        </View>
    </View>
  );
};

const styling = (theme: themeMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 20,
    backgroundColor: colors[theme].WHITE,
    borderBottomColor: colors[theme].WHITE,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors[theme].MAIN,
  },
  loginButton: {
    fontSize: 16,
    color: colors[theme].GRAY_600,
  },
  tabletContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  testLayout: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
    // padding: 30,
  },
  navItemTablet: {
    height: 60,
    width: 160,
    paddingVertical: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors[theme].GRAY_50,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors[theme].GRAY_50,
    backgroundColor: colors[theme].WHITE,
  },
  loadingText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItem: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors[theme].GRAY_50,
  },
  navText: {
    fontSize: 14,
    color: colors[theme].GRAY_700,
    textAlign: 'center',
  },
});

export default HomeScreen;
