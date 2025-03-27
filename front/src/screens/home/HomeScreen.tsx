import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { authNavigation } from '../../constants/navigations';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import useCertificationStore from '../../store/useCertificationStore';
import { mainTabParamList } from '../../navigation/MainTabNavigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import useTablet from '../../hooks/useTablet';
import CertificationAccordion from './components/CertificationAccordion';

// BottomTab의 MainHome 화면 타입 정의
type HomeScreenProps = BottomTabScreenProps<mainTabParamList, 'TabHome'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const isTablet = useTablet();
  const { selectedCertifications } = useCertificationStore();

  const handleSelectLicense = () => {
    // 상위 네비게이터의 화면으로 이동하기 위해 getParent() 사용
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(authNavigation.SELECT_CERTIFICATION);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={isTablet ? styles.tabletContainer : styles.container}>
          <View style={styles.testLayout}>
            {selectedCertifications.length > 0 ? (
              selectedCertifications.map((cert) => (
                <CertificationAccordion
                  key={cert.certificationId}
                  certification={cert}
                />
              ))
            ) : (
              <Pressable style={styles.loadingText} onPress={handleSelectLicense}>
                <Text>자격증을 선택해주세요</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].GRAY_150,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  tabletContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  testLayout: {
    flex: 1,
    backgroundColor: colors[theme].GRAY_150,
  },
  loadingText: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookList: {
    padding: '16@ms',
  },
});

export default HomeScreen;
