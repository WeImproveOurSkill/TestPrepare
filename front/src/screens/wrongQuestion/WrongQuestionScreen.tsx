import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import QuestionList from '../components/QuestionList';
// import { useQuery } from '@tanstack/react-query';
// import { fetchGet } from '../../util/api';
// import { QuestionData } from '../components/QuestionItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';

// 오답노트 화면
const WrongQuestionScreen = () => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // const { data: wrongQuestions } = useQuery<QuestionData[]>({
  //   queryKey: ['wrongQuestions'],
  //   queryFn: () => fetchGet('wrongQuestions'),
  // });

  // 문제 클릭 핸들러
  const handleQuestionSelect = (index: number) => {
    // 네비게이션을 사용하여 QuestionPager 화면으로 이동
    navigation.navigate('QuestionPager', {
      questions: wrongQuestions,
      currentPage: index + 1,
      handlePageChange: (page: number) => console.log('페이지 변경:', page),
      // subjectName: '오답노트',
      mode: 'wrongQuestion',
    });
  };

  return (
    <View style={styles.container}>
      {wrongQuestions?.length === undefined ? (
        <View style={styles.textContainer}>
          <Text style={styles.noQuestionsText}>틀린 문제가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {wrongQuestions?.map((question, index) => (
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
};

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
const wrongQuestions = [
  {
    questionId: '1',
    content: '조건을 만족하는 릴레이션의 수평적 부분집합으로 구성하며, 연산자\n의 기호는 그리스 문자 시그마(σ)를 사용하는 관계대수 연산은?\n\n① Select \n② Project\n\n③ Join \n④ Division',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '2',
    content: '다음과 같이 위쪽 릴레이션을 아래쪽 릴레이션으로 정규화를 하였을\n때 어떤 정규화 작업을 한 것인가?\n국가 도시\n대한민국 서울, 부산\n미국 워싱턴, 뉴욕\n중국 베이징\n↓\n국가 도시\n대한민국 서울\n대한민국 부산\n미국 워싱턴\n미국 뉴욕\n중국 베이징\n3',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '3',
    content: '참조 무결성을 유지하기 위하여 DROP문에서 부모 테이블의 항목\n값을 삭제할 경우 자동적으로 자식 테이블의 해당 레코드를 삭제하\n기 위한 옵션은?\n\n① CLUSTER \n② CASCADE\n\n③ SET-NULL \n④ RESTRICTED',
    answer: '정답',
    explanation: '해설',
  },
  {
    questionId: '10',
    content: '가짜 데이터 요구사항 검증(Requirements Validation)과 관련한 설명으로 틀린것은?',
    answer: '정답',
    explanation: '해설',
  },
];

export default WrongQuestionScreen;
