import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { colors } from '../../constants/colors';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import QuestionList from '../components/QuestionList';
import { useQuery } from '@tanstack/react-query';
import { fetchGet } from '../../util/api';
import { QuestionData } from '../components/QuestionItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import { useFocusEffect } from '@react-navigation/native';

const WrongQuestionScreen = () => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const { data: wrongQuestions, refetch } = useQuery<QuestionData[]>({
    queryKey: ['wrongQuestions'],
    queryFn: () => fetchGet('exam/wrong-questions?status=WRONG'),
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );
  console.log(wrongQuestions);

  // 문제 클릭 핸들러
  const handleQuestionSelect = (index: number) => {
    navigation.navigate('QuestionPager', {
      questions: wrongQuestions,
      currentPage: index + 1,
      mode: 'wrongQuestion',
    });
  };

  return (
    <View style={styles.container}>
      {wrongQuestions?.length === undefined || wrongQuestions?.length === 0 ? (
        <View style={styles.textContainer}>
          <Text style={styles.noQuestionsText}>틀린 문제가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {wrongQuestions?.map((question, index) => (
            <QuestionList
              key={`${question.questionId}_${index}_${Math.random()}`}
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

export default WrongQuestionScreen;
