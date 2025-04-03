import React from 'react';
import { Text, View, Pressable } from 'react-native';
// import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { parseContent } from '../../constants/examParser';

interface QuestionListProps {
  content: string;
  onPress: () => void;
}

function QuestionList({content, onPress}: QuestionListProps) {
  const { theme } = useThemeStore(); // 현재 테마 가져오기
  const styles = styling(theme); // 테마별 스타일 적용
  const parsedQuestion = parseContent(content);

  return (
    <Pressable style={[styles.container]} onPress={onPress}>
      <View style={styles.questionList}>
        <Text style={styles.questionText} numberOfLines={2} ellipsizeMode="tail">
          {parsedQuestion.questionTitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    padding: '12@mvs',
    backgroundColor: colors[theme].WHITE,
    borderBottomColor: colors[theme].GRAY_400,
    borderBottomWidth: 1,
  },
  questionList: {
    flex: 1,
  },
  questionText: {
    fontSize: '16@mvs0.2',
    color: colors[theme].BLACK,
  },
});

export default QuestionList;
