import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import QuestionList from '../components/QuestionList';
import { ScaledSheet } from 'react-native-size-matters';
// import { useQuery } from '@tanstack/react-query';
// import { fetchGet } from '../../util/api';
// import { QuestionData } from '../components/QuestionItem';

interface BookmarkScreenProps {

}

function BookmarkScreen({}: BookmarkScreenProps) {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // const { data: bookmarkQuestions } = useQuery<QuestionData[]>({
  //   queryKey: ['bookmarkQuestions'],
  //   queryFn: () => fetchGet('bookmarkQuestions'),
  // });

  // 문제 클릭 핸들러
  const handleQuestionSelect = (index: number) => {
    // 네비게이션을 사용하여 QuestionPager 화면으로 이동
    navigation.navigate('QuestionPager', {
      questions: bookmarkQuestions,
      currentPage: index + 1,
      handlePageChange: (page: number) => console.log('페이지 변경:', page),
      mode: 'bookmark',
    });
  };

  return (
    <View style={styles.container}>
      {bookmarkQuestions?.length === undefined ? (
        <View style={styles.textContainer}>
          <Text style={styles.noQuestionsText}>북마크가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {bookmarkQuestions?.map((question, index) => (
            <QuestionList
              key={question.questionId}
              content={question.content}
              onPress={() => handleQuestionSelect(index)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noQuestionsText: {
    fontSize: '20@mvs0.2',
    color: colors[theme].GRAY_400,
    textAlign: 'center',
  },
});

// 문제 데이터
const bookmarkQuestions = [
  {
    questionId: '1',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '2',
    content: '가데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '3',
    content: '가데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '4',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은? 가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은? 가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '5',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '6',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '7',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '8',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '9',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '10',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '11',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '12',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '13',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '14',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '15',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
];

export default BookmarkScreen;
