import React, { useState } from 'react';
import { View, Text, Animated, Platform, Pressable, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { extractChoiceNumber, parseContent } from '../../constants/examParser';
import { fetchPost, fetchDelete } from '../../util/api';
import ChoiceItem from './ChoiceItem';
import { UserAnswer } from '../../screens/components/QuestionPagerScreen';
import { useBookmarkStore } from '../../store/useBookmarkStore';


export type QuestionData = {
  questionId: number;
  content: string;
  answer: string;
  explanation: string;
};

// 사용자 선택 상태를 관리하는 인터페이스
interface ChoiceState {
  selectedChoice: string | null;
  showAnswer: boolean;
  isCorrectAnswer: boolean;  // 정답 선택 여부 추가
}

export interface QuestionItemProps {
  question: QuestionData;
  mode: 'study' | 'exam' | 'wrongQuestion' | 'bookmark';
  handleUserAnswer?: (params: UserAnswer) => void;
}

// 문제와 선택지를 표시하고 사용자의 선택을 처리하는 공용 컴포넌트
const QuestionItem = React.memo(({
  question,
  mode,
  handleUserAnswer,
}: QuestionItemProps) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const parsedQuestion = parseContent(question.content);

  // 정답 및 선택한 답변 상태 관리
  const [state, setState] = useState<ChoiceState>({
    selectedChoice: null,
    showAnswer: false,
    isCorrectAnswer: false,
  });
  const [animatedValues] = useState({
    correct: new Animated.Value(0),
    incorrect: new Animated.Value(0),
  });

  // 정답 확인 함수
  const checkAnswer = (choice: string) => {
    // if (mode === 'exam' && state.selectedChoice) {return;} // 이미 선택된 경우 추가 선택 방지
    // 정답을 맞췄을 경우 더 이상 선택 불가
    if (state.isCorrectAnswer) {return;}

    const choiceNumber = extractChoiceNumber(choice);
    const isCorrect = choiceNumber === question.answer;

    setState({
      selectedChoice: choiceNumber,
      showAnswer: mode !== 'exam', // exam 모드에서는 정답 표시 안함
      isCorrectAnswer: mode !== 'exam' && isCorrect, // exam 모드에서는 정답 체크 안함
    });

    // exam 모드가 아닐 때만 서버에 정답 제출
    if (mode !== 'exam') {
      fetchPost('exam/submit/normal', {
        questionId: question.questionId,
        status: isCorrect ? 'CORRECT' : 'WRONG',
      });

      // 애니메이션 실행
      Animated.timing(isCorrect ? animatedValues.correct : animatedValues.incorrect, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }else if (mode === 'exam' && handleUserAnswer) {
      handleUserAnswer({
        questionId: question.questionId,
        answer: question.answer,
        userAnswer: choiceNumber,
      });
    }
  };

  const [loading, setLoading] = useState(false);

  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const isBookmarked = bookmarks.includes(question.questionId);

  const handleStarPress = async () => {
    if (loading) {return;}
    setLoading(true);
    try {
      if (isBookmarked) {
        // 북마크 제거 - DELETE 요청
        await fetchDelete('exam/book-mark', { questionId: question.questionId });
      } else {
        // 북마크 추가 - POST 요청
        await fetchPost('exam/book-mark', { questionId: question.questionId });
      }
    } catch (e) {
      Alert.alert('알림', '북마크 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <Pressable style={styles.iconContainer} onPress={() => handleStarPress()}>
        <FontAwesomeIcons name={isBookmarked ? 'star' : 'star-o'} style={styles.icon} />
      </Pressable>
      <View style={styles.QuestionTitle}>
        <Text style={styles.questionText}>{parsedQuestion.questionTitle}</Text>
      </View>
      <View style={styles.MultipleChoiceAnswers}>
        {parsedQuestion.choices.map((choice, choiceIndex) => (
          <ChoiceItem
            key={choiceIndex}
            choice={choice}
            choiceIndex={choiceIndex}
            theme={theme}
            mode={mode}
            questionAnswer={question.answer}
            selectedChoice={state.selectedChoice}
            showAnswer={state.showAnswer}
            isCorrectAnswer={state.isCorrectAnswer}
            animatedValues={animatedValues}
            onPress={checkAnswer}
          />
        ))}
      </View>
    </View>
  );
});

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  page: {
    flex: 1,
    padding: '16@ms',
    margin: '12@ms',
    marginBottom: Platform.OS === 'ios' ? insets.bottom : 12,
    backgroundColor: colors[theme].WHITE,
    borderRadius: '16@ms',
    borderWidth: 1,
    borderColor: colors[theme].GRAY_200,
  },
  icon: {
    color: colors[theme].MAIN,
    fontSize: '24@mvs0.3',
  },
  iconContainer: {
    height: '20@mvs',
    alignItems: 'flex-end',
  },
  QuestionTitle: {
    padding: '16@ms',
    paddingTop: '24@mvs',
    paddingBottom: '16@mvs',
    marginBottom: '12@mvs',
    minHeight: '80@mvs',
    justifyContent: 'center',
    backgroundColor: colors[theme].WHITE,
    borderRadius: '12@ms',
  },
  MultipleChoiceAnswers: {
    flex: 1,
    marginTop: '8@mvs',
    backgroundColor: colors[theme].WHITE,
    borderRadius: '12@ms',
    padding: '12@ms',
  },
  questionText: {
    fontSize: '18@ms',
    color: colors[theme].BLACK,
    fontWeight: 'bold',
    lineHeight: '26@ms',
  },
});

export default QuestionItem;
