import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import QuestionList from '../components/QuestionList';
import { ScaledSheet } from 'react-native-size-matters';
import { fetchGet } from '../../util/api';
import { QuestionData } from '../components/QuestionItem';
import { useBookmarkStore } from '../../store/useBookmarkStore';

function BookmarkScreen() {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { bookmarks } = useBookmarkStore();
  console.log(bookmarks);


  const { data: bookmarkQuestions } = useQuery<QuestionData[]>({
    queryKey: ['bookmarkQuestions', bookmarks],
    queryFn: () => fetchGet('exam/book-mark/question?certificationId=1'),
    staleTime: 0,
    gcTime: 0,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
    // refetchOnReconnect: true,
  });

  const handleQuestionSelect = (index: number) => {
    // 네비게이션을 사용하여 QuestionPager 화면으로 이동
    navigation.navigate('QuestionPager', {
      questions: bookmarkQuestions,
      currentPage: index + 1,
      handlePageChange: (page: number) => console.log('페이지 변경:', page),
      mode: 'bookmark',
    });
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     refetch();
  //   }, [refetch])
  // );
  console.log(bookmarkQuestions);

  return (
    <View style={styles.container}>
      {bookmarkQuestions?.length === 0 || bookmarkQuestions === undefined ? (
        <View style={styles.textContainer}>
          <Text style={styles.noQuestionsText}>북마크가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {bookmarkQuestions?.map((question, index) => (
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
}

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

export default BookmarkScreen;
