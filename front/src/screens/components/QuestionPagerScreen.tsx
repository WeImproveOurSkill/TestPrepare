import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import CustomPagerView from './CustomPagerView';
import ExamHeader from './ExamHeader';
import QuestionItem, { QuestionData } from './QuestionItem';
import ExplanationModal from './ExplanationModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { useStudyLogic } from '../../hooks/useStudyLogic';

type QuestionPagerScreenProps = NativeStackScreenProps<HomeStackParamList, 'QuestionPager'>;

function QuestionPagerScreen({ route }: QuestionPagerScreenProps) {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);

  const { questions, currentPage, handlePageChange, subjectId, subjectName, mode } = route.params;
  const [currentIndex, setCurrentIndex] = useState(currentPage ? currentPage - 1 : 0);

  // 내부에서만 isVisible 상태 관리
  const [isVisible, setIsVisible] = useState(false);

  // 항상 useStudyLogic을 호출 (React Hooks 규칙)
  const studyLogic = useStudyLogic({
    subjectId,
    currentPage,
    handlePageChange,
  });

  // 모드에 따라 다른 로직 사용
  let displayQuestions: QuestionData[] = [];
  let handleQuestionPageChange = (page: number) => {
    setCurrentIndex(page);
    handlePageChange?.(page);
  };

  // 모드에 따라 적절한 데이터와 핸들러 선택
  if (mode === 'study') {
    // study 모드일 때 useStudyLogic 결과 사용
    displayQuestions = studyLogic.displayQuestions;
    handleQuestionPageChange = studyLogic.handlePageChange;
  } else {
    // study 모드가 아닐 경우 직접 questions 사용
    displayQuestions = questions || [];
  }

  // 현재 보여줄 문제가 있는지 확인
  const currentQuestion = displayQuestions[currentIndex];

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
            />
          ))}
        </CustomPagerView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors[theme].MAIN} />
        </View>
      )}

      {/* 해설 버튼은 mode가 'exam'이 아니고 현재 문제가 있는 경우에만 표시 */}
      {mode !== 'exam' && currentQuestion ? (
        <Pressable style={styles.explanationButton} onPress={() => setIsVisible(true)}>
          <Text style={styles.explanationText}>해설보기</Text>
          <ExplanationModal
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            question={currentQuestion}
            subjectName={subjectName ?? ''}
          />
        </Pressable>
      ) : ''}
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
  explanationButton: {
    position: 'absolute',
    bottom: insets.bottom > 0 ? '40@mvs' : '24@mvs',
    right: '24@ms',
    backgroundColor: colors[theme].MAIN,
    padding: '12@ms',
    borderRadius: '8@ms',
    zIndex: 1,
  },
  explanationText: {
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
    fontSize: '16@ms',
  },
});

export default QuestionPagerScreen;

/*
 * 모드별 기능 설명:
 *
 * 1. study 모드:
 *    - 접근 시 서버에서 questionData를 받아옴
 *    - 해설 버튼이 있음
 *    - 문제의 보기를 클릭하면 바로 정답 체크가 되는 방식
 *    - 정답 체크된 부분이 바로 서버로 true/false 형식으로 전송됨
 *
 * 2. exam 모드:
 *    - 접근 시 해설 버튼이 보이지 않음
 *    - 바로 정답 체크가 되지 않음
 *    - 20개의 문제를 다 풀면 그때 정답 체크를 함
 *    - 더 풀고 싶다면 next 버튼을 클릭해서 20개의 문제를 더 푸는 방식
 *
 * 3. wrongQuestion 모드:
 *    - 접근 전에 이미 틀린 문제들을 받아와서 클릭 시 해당 문제를 보여줌
 *    - 해설 버튼이 있음
 *    - 문제의 보기를 클릭하면 바로 정답 체크가 되는 방식
 */
