import React, { useState, useCallback } from 'react';
import {View, Text, ActivityIndicator, Pressable} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import ExamHeader from '../components/ExamHeader';
import CustomPagerView from '../components/CustomPagerView';
import { fetchGet } from '../../util/api';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import QuestionItem, { QuestionData } from '../components/QuestionItem';
import ExplanationModal from './components/ExplanationModal';

// API 호출 실패 시 사용할 mockData
const mockData: QuestionData[] = [
  {
    questionId: '501',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린\n것은?\n\n① 요구사항이 고객이 정말 원하는 시스템을 제대로 정의하고 있\n는지 점검하는 과정이다.\n\n② 개발완료 이후에 문제점이 발견될 경우 막대한 재작업 비용이\n들 수 있기 때문에 요구사항 검증은 매우 중요하다.\n\n③ 요구사항이 실제 요구를 반영하는지, 문서상의 요구사항은 서\n로 상충되지 않는지 등을 점검한다.\n\n④ 요구사항 검증 과정을 통해 모든 요구사항 문제를 발견할 수\n있다.',
    answer: '④',
    explanation: 'not have explanation1',
},
{
    questionId: '503',
    content: '익스트림 프로그래밍(XP)에 대한 설명으로 틀린 것은?\n\n① 빠른 개발을 위해 테스트를 수행하지 않는다.\n\n② 사용자의 요구사항은 언제든지 변할 수 있다.\n\n③ 고객과 직접 대면하며 요구사항을 이야기하기 위해 사용자 스\n토리(User Story)를 활용할 수 있다.\n\n④ 기존의 방법론에 비해 실용성(Pragmatism)을 강조한 것이라\n고 볼 수 있다.',
    answer: '①',
    explanation: 'not have explanation뻥치지마2',
},
{
    questionId: '505',
    content: '객체지향 설계에서 정보 은닉(Information Hiding)과 관련한 설명으\n로 틀린 것은?\n\n① 필요하지 않은 정보는 접근할 수 없도록 하여 한 모듈 또는\n하부 시스템이 다른 모듈의 구현에 영향을 받지 않게 설계되는\n것을 의미한다.\n\n② 모듈들 사이의 독립성을 유지시키는 데 도움이 된다.\n\n③ 설계에서 은닉되어야 할 기본 정보로는 IP 주소와 같은 물리적\n코드, 상세 데이터 구조 등이 있다.\n\n④ 모듈 내부의 자료 구조와 접근 동작들에만 수정을 국한하기\n때문에 요구사항 등 변화에 따른 수정이 불가능하다.\n- 1',
    answer: '④',
    explanation: 'not have explanation구라 노노염 3',
},
  {
    questionId: '507',
    content: '요구 분석(Requirement Analysis)에 대한 설명으로 틀린 것은?\n\n① 요구 분석은 소프트웨어 개발의 실제적인 첫 단계로, 사용자의\n요구에 대해 이해하는 단계라 할 수 있다.\n\n② 요구 추출(Requirement Elicitation)은 프로젝트 계획 단계에\n정의한 문제의 범위 안에 있는 사용자의 요구를 찾는 단계이다.\n\n③ 도메인 분석(Domain Analysis)은 요구에 대한 정보를 수집하\n고 배경을 분석하여 이를 토대로 모델링을 하게 된다.\n\n④ 기능적(Functional) 요구에서 시스템 구축에 대한 성능, 보안,\n품질, 안정 등에 대한 요구사항을 도출한다.',
    answer: '④',
    explanation: '기능적(Functional) 요구는 시스템이 제공해야 하는 기능을 정의하며, 비기능적(Non-functional) 요구에서 성능, 보안, 품질, 안정 등에 대한 요구사항을 도출합니다.',
  },
];

type StudyScreenProps = NativeStackScreenProps<HomeStackParamList, 'Study'>;

const REMAINING_EXAM_QUESTIONS = 2; // 남은 문제 수

const StudyScreen = ({ route }: StudyScreenProps) => {
  const { certificationId } = route.params;
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 현재 문제 로드
  const { data: questionsList, refetch: fetchNextQuestionsList } = useQuery({
    queryKey: ['questions', certificationId, currentPage],
    queryFn: async () => {
      try {
        return await fetchGet<QuestionData[]>(`exam/subject/${certificationId}/random`);
      } catch (error) {
        console.error('Failed to fetch questions', error);
        setIsError(true);
        return mockData;
      }
    },
  });
    console.log(questionsList);


  // questionsList 데이터 처리
  React.useEffect(() => {
    if (questionsList && Array.isArray(questionsList)) {
      setQuestions(prev => {
        console.log(questionsList);

        const existingIds = new Set(prev.map(q => q.questionId));
        const newQuestions = questionsList.filter(q => !existingIds.has(q.questionId));
        return [...prev, ...newQuestions];
      });
    } else if (isError && questions.length === 0) {
      // API 호출 실패 시 mockData 사용
      setQuestions(mockData);
    }
  }, [questionsList, isError, questions.length]);

  const handlePageChange = useCallback(async (e: number) => {
    const newPosition = e;
    setCurrentPage(newPosition + 1);
    if (newPosition >= questions.length - REMAINING_EXAM_QUESTIONS) {
      await fetchNextQuestionsList();
    }
  }, [questions.length, fetchNextQuestionsList]);

  return (
    <View style={styles.container}>
      <ExamHeader />
      {questions.length > 0 ? (
        <CustomPagerView
          onPageSelected={handlePageChange}
          enableAnimation={true}
          scrollEnabled={true}
          orientation="vertical"
          initialPage={0}
        >
          {questions.map((question, index) => (
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
      <Pressable style={styles.explanationButton} onPress={() => {
        setIsVisible(true);
        console.log(questions[currentPage - 1]);
      }}>
        <Text style={styles.explanationText}>해설보기</Text>
        <ExplanationModal
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          question={questions[currentPage - 1]}
        />
      </Pressable>
    </View>
  );
};

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

export default StudyScreen;
