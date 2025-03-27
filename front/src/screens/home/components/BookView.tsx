import React, { useState } from 'react';
import { View, Platform, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import SelectModeModal from './SelectModeModal';
import { HomeStackParamList } from '../../../navigation/HomeStackNavigator';
import { Subject } from './CertificationAccordion';
import useThemeStore, { themeMode } from '../../../store/useThemeStore';
import { colors } from '../../../constants/colors';

const COLOR_MAPPING = {
  '정보처리기사': '#4A90E2',  // 정보처리 계열 파란색
  '전기기사': '#4A90E2',     // 전기 계열 초록색
  '인테리어기사': '#2ECC71', // 인테리어 계열 보라색
  '토목기사': '#E67E22',     // 토목 계열 주황색
  '건축기사': '#E74C3C',     // 건축 계열 빨간색
  '문제': '#4A90E2',     // 문제 계열 파란색
  '해설': '#2ECC71',     // 해설 계열 초록색
  '모의고사': '#E67E22',     // 모의고사 계열 주황색
  default: '#2980b9',       // 기본 색상
} as const;

type ColorKeys = keyof typeof COLOR_MAPPING;


const BookView = ({ subjectId, subjectName }: Subject) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useThemeStore();
  const styles = styling(theme);

  const handleStudyPress = () => {
    navigation.navigate('Study', {
      subjectId: subjectId,
      subjectName: subjectName,
    });
  };

  const handleExamPress = () => {
    navigation.navigate('Exam', {
      subjectId: subjectId,
      subjectName: subjectName,
    });
  };

  const getColor = (title: string) => {
    return COLOR_MAPPING[title as ColorKeys] || COLOR_MAPPING.default;
  };

  const backgroundColor = getColor(subjectName);

  return (
    <Pressable style={styles.container} onPress={() => setIsVisible(true)}>
      <View style={[styles.bookCover, { backgroundColor }]}>
        {/* <View style={[styles.bookSpine, { backgroundColor: spineColor }]} />
        <View style={styles.bookPages} /> */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={2}>
            {subjectName}
          </Text>
          <SelectModeModal
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            subjectName={subjectName}
            onStudyPress={handleStudyPress}
            onExamPress={handleExamPress}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styling = (theme: themeMode) => ScaledSheet.create({

  container: {
    margin: '16@ms',
  },
  bookCover: {
    width: '150@ms0.1',
    height: '200@mvs0.2',
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
  // bookSpine: {
  //   position: 'absolute',
  //   bottom: 2,
  //   left: -10,
  //   width: 20,
  //   height: '100%',
  //   transform: [
  //     { skewY: '15deg' },
  //   ],
  // },
  // bookPages: {
  //   position: 'absolute',
  //   right: 0,
  //   width: 3,
  //   height: '96%',
  //   top: '2%',
  //   backgroundColor: '#fff',
  //   // transform: [
  //   //   { skewY: '-5deg' },
  //   // ],
  // },
  titleContainer: {
    position: 'absolute',
    top: '20%',
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  titleText: {
    color: colors[theme].WHITE,
    fontSize: '20@ms0.2',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default BookView;
