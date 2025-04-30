import React, { useState } from 'react';
import { View, Platform, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import SelectModeModal from './SelectModeModal';
import { HomeStackParamList } from '../../../navigation/HomeStackNavigator';
import { Subject } from '../../../store/useSubjectStore';
import useThemeStore, { themeMode } from '../../../store/useThemeStore';
import { colors } from '../../../constants/colors';

const COLOR_MAPPING = {
  '정보처리기사': '#4A90E2',
  '전기기사': '#4A90E2',
  '인테리어기사': '#2ECC71',
  '토목기사': '#E67E22',
  '건축기사': '#E74C3C',
  default: '#2980b9',
} as const;

type ColorKeys = keyof typeof COLOR_MAPPING;

interface Props extends Subject {
  certificationId: number;
}

const BookView = ({ subjectId, subjectName, certificationId }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useThemeStore();
  const styles = styling(theme);

  const handleStudyPress = () => {
    navigation.navigate('QuestionPager', {
      subjectId: subjectId,
      subjectName: subjectName,
      mode: 'study',
    });
  };

  const handleExamPress = () => {
    navigation.navigate('Exam', {
      subjectId: subjectId,
      subjectName: subjectName,
      certificationId: certificationId,
    });
  };

  const getColor = (title: string) => {
    return COLOR_MAPPING[title as ColorKeys] || COLOR_MAPPING.default;
  };

  const backgroundColor = getColor(subjectName);

  return (
    <Pressable style={styles.container} onPress={() => setIsVisible(true)}>
      <View style={[styles.bookCover, { backgroundColor }]}>
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
    width: '100%',
    alignItems: 'center',
    maxWidth: '400@ms',
    padding: '16@mvs0.2',
  },
  bookCover: {
    width: '100%',
    height: '60@mvs0.2',
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
  titleContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: colors[theme].UNCHANGE_WHITE,
    fontSize: '20@ms0.2',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default BookView;
