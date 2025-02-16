import React, { useState } from 'react';
import { View, StyleSheet, Platform, Text, Pressable } from 'react-native';
import SelectModeModal from './SelectModeModal';
import { AuthStackParamList } from '../../../navigation/AuthStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';


const COLOR_MAPPING = {
  electricity: '#4A90E2',  // 전기 계열 파란색
  architecture: '#9B59B6', // 건축 계열 보라색
  interior: '#2ECC71',     // 인테리어 계열 초록색
  default: '#2980b9',       // 기본 색상
} as const;

type ColorKeys = keyof typeof COLOR_MAPPING;

type BookViewProps = {
  // subjectId: string
  coverColor?: ColorKeys | string;
  title: string;
  navigation: StackNavigationProp<AuthStackParamList>;
}

const BookView = ({ coverColor, title, navigation}: BookViewProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleQuizPress = () => {
    navigation.navigate('Quiz');
  };

  const handleStudyPress = () => {
    navigation.navigate('Study');
  };

  const handleExamPress = () => {
    navigation.navigate('Exam');
  };

  // const spineColor = getDarkerColor(coverColor);
  // const handleSelectLicense = () => {
  //   navigation.navigate(authNavigation.EXAM, {
  //     subjectId,
  //   });
  // };
  // 색상 결정 함수

  // getColor 함수의 매개변수 타입을 수정
const getColor = (color?: ColorKeys | string): string => {
  // color가 없을 경우 기본 색상 반환
  if (!color) {
    return COLOR_MAPPING.default;
  }

  // COLOR_MAPPING에 있는 키값인지 확인
  if (color in COLOR_MAPPING) {
    return COLOR_MAPPING[color as ColorKeys];
  }

  // 직접 입력된 hex 색상 코드인 경우
  if (color.startsWith('#')) {
    return color;
  }

  // 그 외의 경우 기본 색상 반환
  return COLOR_MAPPING.default;
};

  const backgroundColor = getColor(coverColor);

  return (
    <Pressable style={styles.container} onPress={() => setIsVisible(true)}>
      <View style={[styles.bookCover, { backgroundColor }]}>
        {/* <View style={[styles.bookSpine, { backgroundColor: spineColor }]} />
        <View style={styles.bookPages} /> */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={2}>
            {title}
          </Text>
          {/* <Text style={styles.authorText}>
            {author}
          </Text> */}
          <SelectModeModal
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            title={title}
            onQuizPress={handleQuizPress}
            onStudyPress={handleStudyPress}
            onExamPress={handleExamPress}
          />
        </View>
      </View>
    </Pressable>
  );
};

// // RGB 값을 75%로 조정하는 함수
// const getDarkerColor = (hexColor: string) => {
//   const r = parseInt(hexColor.slice(1, 3), 16);
//   const g = parseInt(hexColor.slice(3, 5), 16);
//   const b = parseInt(hexColor.slice(5, 7), 16);

//   const darkerR = Math.floor(r * 0.75);
//   const darkerG = Math.floor(g * 0.75);
//   const darkerB = Math.floor(b * 0.75);

//   return '#' +
//     darkerR.toString(16).padStart(2, '0') +
//     darkerG.toString(16).padStart(2, '0') +
//     darkerB.toString(16).padStart(2, '0');
// };

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  bookCover: {
    width: 150,
    height: 200,
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  authorText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default BookView;
