import React, { useState } from 'react';
import { View, Text, Pressable, Animated, Platform } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { extractChoiceNumber, parseContent } from '../../constants/examParser';

export type QuestionData = {
  questionId: string;
  content: string;
  answer: string;
  explanation: string;
};

// 사용자 선택 상태를 관리하는 인터페이스
interface ChoiceState {
  selectedChoice: string | null;
  showAnswer: boolean;
}

export interface QuestionItemProps {
  question: QuestionData;
}

// 문제와 선택지를 표시하고 사용자의 선택을 처리하는 공용 컴포넌트
const QuestionItem = React.memo(({
  question,
}: QuestionItemProps) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const parsedQuestion = parseContent(question.content);

  // 정답 및 선택한 답변 상태 관리
  const [state, setState] = useState<ChoiceState>({
    selectedChoice: null,
    showAnswer: false,
  });
  const [animatedValues] = useState({
    correct: new Animated.Value(0),
    incorrect: new Animated.Value(0),
  });

  // 정답 확인 함수
  const checkAnswer = (choice: string) => {
    // if (state.selectedChoice) {return;} // 이미 선택된 경우 추가 선택 방지

    const choiceNumber = extractChoiceNumber(choice);
    setState({
      selectedChoice: choiceNumber,
      showAnswer: true,
    });

    // 정답 여부 확인 - 원문자 기호로 직접 비교
    const isCorrect = choiceNumber === question.answer;

    // 애니메이션 실행
    Animated.timing(isCorrect ? animatedValues.correct : animatedValues.incorrect, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.page}>
      <View style={styles.QuestionTitle}>
        <Text style={styles.questionText}>{parsedQuestion.questionTitle}</Text>
      </View>
      <View style={styles.MultipleChoiceAnswers}>
        {parsedQuestion.choices.map((choice, choiceIndex) => {
          const choiceNumber = extractChoiceNumber(choice);
          const isSelected = state.selectedChoice === choiceNumber;
          const isCorrect = state.showAnswer && choiceNumber === question.answer;
          const isIncorrect = state.showAnswer && isSelected && !isCorrect;

          // 배경색 애니메이션
          const backgroundColor = isCorrect
            ? animatedValues.correct.interpolate({
                inputRange: [0, 1],
                outputRange: [colors[theme].WHITE, colors[theme].GREEN_400], // GREEN_400 사용
              })
            : isIncorrect
              ? animatedValues.incorrect.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors[theme].WHITE, colors[theme].RED_300], // RED_300 사용
                })
              : colors[theme].WHITE;

          // 테두리 애니메이션
          const borderColor = isCorrect
            ? animatedValues.correct.interpolate({
                inputRange: [0, 1],
                outputRange: [colors[theme].GRAY_200, colors.light.interior], // interior(초록색) 사용
              })
            : isIncorrect
              ? animatedValues.incorrect.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors[theme].GRAY_200, colors[theme].RED_500],
                })
              : colors[theme].GRAY_200;

          return (
            <Pressable
              key={choiceIndex}
              onPress={() => checkAnswer(choice)}
              style={({ pressed }) => [
                styles.choiceContainer,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Animated.View style={[
                styles.choiceItem,
                {
                  backgroundColor,
                  borderColor,
                },
              ]}>
                <Text style={styles.choiceText}>{choice}</Text>
              </Animated.View>
            </Pressable>
          );
        })}
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
  choiceContainer: {
    marginBottom: '12@ms',
  },
  choiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors[theme].GRAY_200,
    borderRadius: '8@ms',
    padding: '12@ms',
    paddingVertical: '12@ms',
  },
  choiceText: {
    flex: 1,
    fontSize: '16@ms',
    color: colors[theme].BLACK,
    lineHeight: '22@ms',
  },
});

export default QuestionItem;
