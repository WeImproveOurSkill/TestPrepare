import React from 'react';
import { View, Text, Pressable, useWindowDimensions, FlatList } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ScaledSheet } from 'react-native-size-matters';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import BookView from './components/BookView';
import { authNavigation } from '../../constants';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import useCertificationStore from '../../store/useCertificationStore';
import { mainTabParamList } from '../../navigation/MainTabNavigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// BottomTab의 MainHome 화면 타입 정의
type HomeScreenProps = BottomTabScreenProps<mainTabParamList, 'TabHome'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const isTablet = DeviceInfo.isTablet();
  const { width } = useWindowDimensions();
  const { selectedCertifications } = useCertificationStore();

  const handleSelectLicense = () => {
    // 상위 네비게이터의 화면으로 이동하기 위해 getParent() 사용
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(authNavigation.SELECT_CERTIFICATION);
    }
  };

  console.log('HomeScreen certifications:', selectedCertifications);

  return (
    <View style={styles.container}>
      <View style={isTablet && width >= 600 ? styles.tabletContainer : styles.container}>
        <View style={styles.testLayout}>
          {selectedCertifications.length > 0 ? (
            <FlatList
              data={selectedCertifications}
              keyExtractor={(item) => item.certificationId.toString()}
              renderItem={({ item }) => (
                <BookView
                  certificationId={item.certificationId}
                  certificationName={item.certificationName}
                />
              )}
              contentContainerStyle={styles.bookList}
            />
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
    backgroundColor: colors[theme].GRAY_150,
  },
  tabletContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  testLayout: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookList: {
    padding: '16@ms',
  },
});

export default HomeScreen;
