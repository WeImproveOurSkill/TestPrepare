import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookView from './components/BookView';
import { authNavigation } from '../../constants';
// import { useTheme } from '../../contexts/ThemeContext';

type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;


const HomeScreen = ({navigation}:AuthHomeScreenProps) => {
  // const { theme, isDark, toggleTheme } = useTheme();
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
        ...(!isTablet && {paddingBottom: insets.bottom}),
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
            <View style={ !isTablet && styles.bottomNav }>
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
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF984A',
  },
  loginButton: {
    fontSize: 16,
    color: '#666666',
  },
  tabletContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  testLayout: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // padding: 30,
  },
  testContainer: {
    height: 200,
    width: 200,
    backgroundColor: 'blue',
  },
  bookCover: {
    width: 150,
    height: 200,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  bookSpine: {
    position: 'absolute',
    // bottom: 2,
    // left: -13,
    width: 20,
    height: '100%',
    backgroundColor: '#c0392b',
    // transform: [
    //   { skewY: '10deg' },
    // ],
  },
  bookPages: {
    position: 'absolute',
    right: 0,
    width: 3,
    height: '96%',
    top: '2%',
    backgroundColor: '#fff',
    // transform: [
    //   { skewY: '-5deg' },
    // ],
  },
  navItemTablet: {
    height: 60,
    width: 160,
    paddingVertical: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    backgroundColor: '#ffffff',
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 24,
    textAlign: 'center',
    color: '#333333',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
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
    borderRightColor: '#e1e1e1',
  },
  navText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default HomeScreen;
