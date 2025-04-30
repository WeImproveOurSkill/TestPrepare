import React from 'react';
import { Text, Pressable, Animated } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { extractChoiceNumber } from '../../constants/examParser';

// 선택지 아이템 컴포넌트 Props
export interface ChoiceItemProps {
  choice: string;
  choiceIndex: number;
  theme: themeMode;
  mode: 'study' | 'exam' | 'wrongQuestion' | 'bookmark';
  questionAnswer: string;
  selectedChoice: string | null;
  showAnswer: boolean;
  isCorrectAnswer: boolean;
  animatedValues: {
    correct: Animated.Value;
    incorrect: Animated.Value;
  };
  onPress: (choice: string) => void;
}

// 개별 선택지 컴포넌트
const ChoiceItem = React.memo(({
  choice,
  choiceIndex,
  theme,
  mode,
  questionAnswer,
  selectedChoice,
  showAnswer,
  isCorrectAnswer,
  animatedValues,
  onPress,
}: ChoiceItemProps) => {
  const styles = styling(theme);
  const choiceNumber = extractChoiceNumber(choice);
  const isSelected = selectedChoice === choiceNumber;

  // exam 모드와 다른 모드에서 다르게 처리
  let backgroundColor, borderColor;

  if (mode === 'exam') {
    // exam 모드에서는 선택된 항목만 회색으로 표시
    backgroundColor = isSelected
      ? colors[theme].GRAY_200
      : colors[theme].WHITE;

    borderColor = isSelected
      ? colors[theme].GRAY_600
      : colors[theme].GRAY_200;
  } else {
    // study 모드 등에서는 정답/오답 표시
    const isCorrect = showAnswer && choiceNumber === questionAnswer;
    const isIncorrect = showAnswer && isSelected && !isCorrect;

    // 배경색 애니메이션
    backgroundColor = isCorrect
      ? animatedValues.correct.interpolate({
          inputRange: [0, 1],
          outputRange: [colors[theme].WHITE, colors[theme].GREEN_300],
        })
      : isIncorrect
        ? animatedValues.incorrect.interpolate({
            inputRange: [0, 1],
            outputRange: [colors[theme].WHITE, colors[theme].RED_500],
          })
        : colors[theme].WHITE;
    // 테두리 애니메이션
    borderColor = isCorrect
      ? animatedValues.correct.interpolate({
          inputRange: [0, 1],
          outputRange: [colors[theme].GRAY_200, colors.light.interior],
        })
      : isIncorrect
        ? animatedValues.incorrect.interpolate({
            inputRange: [0, 1],
            outputRange: [colors[theme].GRAY_200, colors[theme].RED_500],
          })
        : colors[theme].GRAY_200;
  }

  return (
    <Pressable
      key={choiceIndex}
      onPress={() => onPress(choice)}
      style={({ pressed }) => [
        styles.choiceContainer,
        { opacity: pressed && (mode === 'exam' || !isCorrectAnswer) ? 0.8 : 1 },
      ]}
      disabled={mode !== 'exam' && isCorrectAnswer} // exam 모드에서는 항상 비활성화
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
});

const styling = (theme: themeMode) => ScaledSheet.create({
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

export default ChoiceItem;
