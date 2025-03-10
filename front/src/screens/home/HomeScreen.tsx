import React from 'react';
import { View, Text, Pressable, useWindowDimensions, FlatList } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StackScreenProps } from '@react-navigation/stack';
import { ScaledSheet } from 'react-native-size-matters';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import BookView from './components/BookView';
import { authNavigation } from '../../constants';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { Certification } from '../selectCertification/SelectCertificationScreen';

type HomeScreenProps = StackScreenProps<AuthStackParamList, 'Home'>;

const HomeScreen = ({ navigation, route }: HomeScreenProps) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const isTablet = DeviceInfo.isTablet();
  const { width } = useWindowDimensions();

  const handleSelectLicense = () => {
    navigation.navigate(authNavigation.SELECT_CERTIFICATION);
  };

  // 자격증 처리를 위한 로직
  let certificationsArray: Certification[] = [];

  // route.params가 있는지 확인
  if (route.params?.certifications) {
    const { certifications } = route.params;

    // certifications가 배열인지 단일 객체인지 확인
    if (Array.isArray(certifications)) {
      certificationsArray = certifications;
    } else {
      // 단일 자격증 객체인 경우 배열로 변환
      certificationsArray = [certifications];
    }
  }

  return (
    <View style={styles.container}>
      <View style={isTablet && width >= 600 ? styles.tabletContainer : styles.container}>
        <View style={styles.testLayout}>
          {certificationsArray.length > 0 ? (
            <FlatList
              data={certificationsArray}
              keyExtractor={(item) => item.certificationId.toString()}
              renderItem={({ item }) => (
                <BookView
                  title={item.certificationName}
                  navigation={navigation}
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
    // backgroundColor: colors[theme].WHITE,
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
