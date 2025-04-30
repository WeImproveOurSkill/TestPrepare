import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import CustomPagerView from './CustomPagerView';
import ExamHeader from './ExamHeader';
import QuestionItem from './QuestionItem';
import ExplanationModal from './ExplanationModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { useStudyLogic } from '../../hooks/useStudyLogic';
import { useExamLogic } from '../../hooks/useExamLogic';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SubmitExamModal from './SubmitExamModal';
import { useMutation } from '@tanstack/react-query';
import { fetchGPTPost, fetchPost } from '../../util/api';
import { useSubjectStore } from '../../store/useSubjectStore';

type QuestionPagerScreenProps = NativeStackScreenProps<HomeStackParamList, 'QuestionPager'>;

interface ExplanationResponse {
  explanation: string;
}

export interface UserAnswer {
  questionId: number;
  answer: string;
  userAnswer: string;
}

function QuestionPagerScreen({ route }: QuestionPagerScreenProps) {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const {
    questions,
    currentPage,
    handlePageChange,
    subjectId,
    subjectName,
    certificationId,
    mode,
    year,
    session,
  } = route.params;

  const setCurrentExamContext = useSubjectStore((state) => state.setCurrentExamContext);

  const [examModalVisible, setExamModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 로직 훅 호출을 위한 기본 파라미터
  const studyLogicProps = {
    subjectId,
    currentPage,
    handlePageChange,
  };
  const examLogicProps = {
    subjectId: subjectId!,
    year: year!,
    session: session!,
    currentPage,
    handlePageChange,
  };

  // 1. 상태 추가
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const handleUserAnswer = ({ questionId, answer, userAnswer}: UserAnswer) => {
    if (mode !== 'exam') {return;}
    setUserAnswers(prev =>
      prev.some(ans => ans.questionId === questionId)
        ? prev.map(ans =>
            ans.questionId === questionId ? { questionId, answer, userAnswer} : ans
          )
        : [...prev, { questionId, answer, userAnswer}]
    );
  };

  // 모드에 따라 다른 로직 사용
  const StudyModeLogic = () => {
    const studyLogic = useStudyLogic(studyLogicProps);
    return {
      displayQuestions: studyLogic.displayQuestions,
      currentIndex: studyLogic.currentIndex,
      handlePageChange: studyLogic.handlePageChange,
    };
  };

  const ExamModeLogic = () => {
    const examLogic = useExamLogic(examLogicProps);
    return {
      displayQuestions: examLogic.displayQuestions,
      currentIndex: examLogic.currentIndex,
      handlePageChange: examLogic.handlePageChange,
    };
  };

  const DefaultModeLogic = () => {
    const [currentIndex, setCurrentIndex] = useState(currentPage ? currentPage - 1 : 0);
    return {
      displayQuestions: questions || [],
      currentIndex,
      handlePageChange: (page: number) => {
        console.log('handleQuestionPageChange', page);
        setCurrentIndex(page);
        handlePageChange?.(page);
      },
    };
  };

  // 모드에 따라 적절한 로직 선택
  const { displayQuestions, currentIndex, handlePageChange: handleQuestionPageChange } =
    mode === 'study'
      ? StudyModeLogic()
      : mode === 'exam'
        ? ExamModeLogic()
        : DefaultModeLogic();

  // 현재 보여줄 문제가 있는지 확인
  const currentQuestion = displayQuestions[currentIndex];

  const postExamResult = useMutation({
    mutationFn: async () => {
      const endpoint = 'exam/submit/test';
      return await fetchPost(endpoint, userAnswers);
    },
    onSuccess: () => {
      if (
        subjectId !== undefined &&
        subjectName !== undefined &&
        certificationId !== undefined &&
        year !== undefined &&
        session !== undefined
      ) {
        setCurrentExamContext({
          subjectId: subjectId,
          subjectName: subjectName,
          certificationId: certificationId,
        });
        navigation.navigate('ExamResult', {
          userAnswers,
          year: year,
          session: session,
        });
      } else {
        console.error('Cannot navigate to results: Missing required parameters.');
      }
    },
    onError: (error) => {
      console.error('Failed to submit exam results:', error);
    },
  });

  const handleExamCompleted = () => {
    setExamModalVisible(false);
    postExamResult.mutate();
  };

  const [explanationMap, setExplanationMap] = useState<{ [key: number]: string | null }>({});

const gptExplanationMutation = useMutation({
  mutationFn: async (data: any) => {
    const response = await fetchGPTPost<ExplanationResponse>('recommend/gpt-assistance', data);
    return response;
  },
  onSuccess: (response, variables) => {
    console.log(response);
    setExplanationMap(prev => ({
      ...prev,
      [variables.questionId]: response?.explanation ?? null,
    }));
  },
});

useEffect(() => {
  if (
    currentQuestion &&
    (explanationMap[currentQuestion.questionId] === undefined || explanationMap[currentQuestion.questionId] === null) &&
    !gptExplanationMutation.isPending
  ) {
    const requestData = {
      questionId: currentQuestion.questionId,
      content: currentQuestion.content,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
      subjectName: subjectName,
    };
    gptExplanationMutation.mutate(requestData);
  }
}, [currentQuestion, explanationMap, gptExplanationMutation.isPending, subjectName, gptExplanationMutation]);

const handleRefetchExplanation = useCallback(() => {
  if (currentQuestion) {
    const requestData = {
      questionId: currentQuestion.questionId,
      content: currentQuestion.content,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
      subjectName: subjectName,
    };
    gptExplanationMutation.mutate(requestData);
  }
}, [currentQuestion, subjectName, gptExplanationMutation]);

  return (
    <View style={styles.container}>
      <ExamHeader />
      {displayQuestions.length > 0 ? (
        <CustomPagerView
          onPageSelected={handleQuestionPageChange}
          enableAnimation={true}
          scrollEnabled={true}
          orientation="vertical"
          initialPage={currentIndex}
        >
          {displayQuestions.map((question, index) => (
            <QuestionItem
              key={`${question.questionId}_${index}`}
              question={question}
              mode={mode}
              {...(mode === 'exam' && { handleUserAnswer })}
            />
          ))}
        </CustomPagerView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors[theme].MAIN} />
        </View>
      )}
      {/* 시험 완료 버튼은 mode가 'exam'일때 표시 */}
      {mode === 'exam' ? (
        <Pressable style={[styles.ButtonContainer, userAnswers.length === 0
          && { backgroundColor: colors[theme].GRAY_300 },
        ]}
          onPress={() => setExamModalVisible(true)}
          disabled={userAnswers.length === 0}
        >
          <Text style={styles.buttonText}>시험 완료</Text>
          <SubmitExamModal
            isVisible={examModalVisible}
            onClose={() => setExamModalVisible(false)}
            handleExamCompleted={handleExamCompleted}
          />
        </Pressable>
      ) : <Pressable style={styles.ButtonContainer} onPress={() => setIsVisible(true)}>
            <Text style={styles.buttonText}>해설보기</Text>
            <ExplanationModal
              isVisible={isVisible}
              onClose={() => setIsVisible(false)}
              explanation={
                gptExplanationMutation.isPending || !explanationMap[currentQuestion?.questionId]
                  ? null
                  : explanationMap[currentQuestion?.questionId]
              }
              isLoading={gptExplanationMutation.isPending}
              onRefetch={handleRefetchExplanation}
            />
          </Pressable>
      }
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
  ButtonContainer: {
    position: 'absolute',
    bottom: insets.bottom > 0 ? '40@mvs' : '24@mvs',
    right: '24@ms',
    backgroundColor: colors[theme].MAIN,
    padding: '12@ms',
    borderRadius: '8@ms',
    zIndex: 1,
  },
  buttonText: {
    fontSize: '16@ms0.2',
    color: colors[theme].WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors[theme].RED_500,
    fontSize: '16@ms0.2',
  },
});

export default QuestionPagerScreen;
