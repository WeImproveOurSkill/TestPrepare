import React, { useState, useCallback, useMemo } from 'react';
import {View, Text, Platform} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useQuery } from '@tanstack/react-query';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import ExamHeader from '../components/ExamHeader';
import CustomPagerView from '../components/CustomPagerView';
import { fetchGet } from '../../util/api';

type QuestionData = {
  questionId: string;
  content: string;
  answer: string;
  explanation: string;
}

const PREFETCH_COUNT = 2; // 미리 로드할 문제 수

function StudyScreen() {
  const {theme} = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  // 현재 문제 로드
  const { data: currentQuestion } = useQuery<QuestionData>({
    queryKey: ['questions', 'current'],
    queryFn: () => fetchGet<QuestionData>('exam/subject/1/random'),
  });

  // 현재 문제 데이터 처리
  React.useEffect(() => {
    if (currentQuestion && !questions.find(q => q.questionId === currentQuestion.questionId)) {
      setQuestions(prev => [...prev, currentQuestion]);
    }
  }, [currentQuestion, questions]);

  // 다음 문제 미리 로드
  const prefetchNextQuestion = useCallback(async () => {
    const data = await fetchGet<QuestionData>('exam/subject/1/random');
    if (data && !questions.find(q => q.questionId === data.questionId)) {
      setQuestions(prev => [...prev, data]);
    }
  }, [questions]);

  // 초기 데이터 설정 및 프리페치
  React.useEffect(() => {
    if (currentQuestion) {
      // 초기 문제 설정 후 다음 문제들 미리 로드
      for (let i = 0; i < PREFETCH_COUNT; i++) {
        prefetchNextQuestion();
      }
    }
  }, [currentQuestion, prefetchNextQuestion]);

  const handlePageChange = useCallback(async (e: any) => {
    const newPosition = e.nativeEvent.position;
    if (newPosition >= questions.length - PREFETCH_COUNT) {
      // 남은 프리패치된 문제가 PREFETCH_COUNT개 이하면 새로운 문제 로드
      prefetchNextQuestion();
    }
  }, [questions.length, prefetchNextQuestion]);

  const renderQuestions = useMemo(() => {
    return questions.map((question, index) => (
      <View key={`${question.questionId}_${index}`} style={styles.page}>
        <View style={styles.QuestionTitle}>
          <Text style={styles.questionText}>{question.content}</Text>
        </View>
        <View style={styles.MultipleChoiceAnswers}>
          <Text style={styles.answerText}>{question.answer}</Text>
        </View>
      </View>
    ));
  }, [questions, styles]);

  return (
    <View style={styles.container}>
      <ExamHeader />
      <CustomPagerView
        onPageSelected={handlePageChange}
        enableAnimation={true}
      >
        {renderQuestions}
      </CustomPagerView>
      <View style={styles.explanationButton}>
        <Text style={styles.explanationText}>해설보기</Text>
      </View>
    </View>
  );
}

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
  },
  content: {
    flex: 1,
    backgroundColor: colors[theme].GRAY_100,
  },
  page: {
    flex: 1,
    padding: '24@ms',
    margin: '12@ms',
    marginBottom: Platform.OS === 'ios' ? insets.bottom : 12,
    backgroundColor: colors[theme].WHITE,
    borderRadius: '16@ms',
    borderWidth: 1,
    borderColor: colors[theme].GRAY_200,
  },
  QuestionTitle: {
    paddingTop: '60@mvs',
    minHeight: '100@mvs',
    justifyContent: 'center',
    backgroundColor: colors[theme].WHITE,
    borderRadius: '12@ms',
    padding: '16@ms',
  },
  MultipleChoiceAnswers: {
    flex: 1,
    marginTop: '24@mvs',
    backgroundColor: colors[theme].WHITE,
    borderRadius: '12@ms',
    padding: '16@ms',
  },
  questionText: {
    fontSize: '18@ms',
    color: colors[theme].BLACK,
    fontWeight: 'bold',
  },
  answerText: {
    fontSize: '16@ms',
    color: colors[theme].BLACK,
  },
  explanationButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? '40@mvs' : '24@mvs',
    right: '24@ms',
    backgroundColor: colors[theme].MAIN,
    padding: '12@ms',
    borderRadius: '8@ms',
    zIndex: 1,
  },
  explanationText: {
    color: colors[theme].WHITE,
  },
});

export default StudyScreen;
