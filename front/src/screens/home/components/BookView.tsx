import React, { useState } from 'react';
import { View, Platform, Text, Pressable } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import SelectModeModal from './SelectModeModal';
import { AuthStackParamList } from '../../../navigation/AuthStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';


const COLOR_MAPPING = {
  '정보처리기사': '#4A90E2',  // 정보처리 계열 파란색
  '전기기사': '#4A90E2',     // 전기 계열 초록색
  '인테리어기사': '#2ECC71', // 인테리어 계열 보라색
  '토목기사': '#E67E22',     // 토목 계열 주황색
  '건축기사': '#E74C3C',     // 건축 계열 빨간색
  default: '#2980b9',       // 기본 색상
} as const;

type ColorKeys = keyof typeof COLOR_MAPPING;

type BookViewProps = {
  title: string;
  navigation: StackNavigationProp<AuthStackParamList>;
}

const BookView = ({ title, navigation }: BookViewProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const styles = styling();

  const handleQuizPress = () => {
    navigation.navigate('Quiz');
  };

  const handleStudyPress = () => {
    navigation.navigate('Study');
  };

  const handleExamPress = () => {
    navigation.navigate('Exam');
  };

  const getColor = (title: string) => {
    return COLOR_MAPPING[title as ColorKeys] || COLOR_MAPPING.default;
  };

  const backgroundColor = getColor(title);

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

const styling = () => ScaledSheet.create({

  container: {
    padding: 30,
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
    color: '#fff',
    fontSize: '20@ms0.2',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  authorText: {
    color: '#fff',
    fontSize: '12@ms0.2',
    textAlign: 'center',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default BookView;
