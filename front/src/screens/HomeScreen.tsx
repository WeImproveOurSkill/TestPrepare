import React from 'react';
import { View, Text, StyleSheet, Pressable} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { authNavigation } from '../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthStackNavigator';
import getHeaderMarginTop from '../util/getHeaderMarginTop';

type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;


const HomeScreen = ({navigation}:AuthHomeScreenProps) => {

  const marginTop = getHeaderMarginTop();

  const isTablet = DeviceInfo.isTablet();

  const handleSelectLicense = () => {
    navigation.navigate(authNavigation.AUTH_HOME);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop }, isTablet && styles.tabletHeader]}>
        <Text style={styles.title}>기한82</Text>
        <Text style={styles.loginButton}>로그인</Text>
      </View>
      <View style={!isTablet ? styles.mainContainer : styles.tabletContainer}>
        <View style={styles.moonjaeContainer}>
          <Pressable style={styles.loadingText} onPress={handleSelectLicense}>
            <Text >자격증을 선택해주세요</Text>
          </Pressable>
        </View>
          <View style={ !isTablet ? styles.bottomNav : styles.tabletMenubarContainer}>
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
    padding: 16,
    backgroundColor: '#ffffff',
  },
  tabletHeader: {
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff984adb',
  },
  loginButton: {
    fontSize: 16,
    color: '#666666',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabletContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  moonjaeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 30,
  },
  tabletMenubarContainer: {
    flexDirection: 'column',
    width: 160,
  },
  navItemTablet: {
    height: 60,
    paddingVertical: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
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
