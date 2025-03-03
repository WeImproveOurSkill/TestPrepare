import React from 'react';
import {View, Text} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import ExamHeader from '../components/ExamHeader';
import { useQuery } from '@tanstack/react-query';
import { fetchGet } from '../../util/api';

type QuestionData = {
  questionId: string;
  content: string;
  answer: string;
  explanation: string;
}

function StudyScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  const { data } = useQuery<QuestionData>({ queryKey: ['questions'],
    queryFn: () => fetchGet<QuestionData>('/exam/subject/1/random'),
  });
  console.log(data);



  return (
    <View style={styles.container}>
      <ExamHeader />
        <View style={styles.content}>
          <View style={styles.QuestionTitle}><Text>{data?.content}</Text></View>
          <View style={styles.QuestionBody}><Text>문제 내용</Text></View>
          <View style={styles.MultipleChoiceAnswers}><Text>{data?.answer}</Text></View>
          <View><Text>해설버튼 우하단 모달 예정</Text></View>
        </View>
    </View>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex:1,
    backgroundColor: 'green',
  },
  content: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors[theme].WHITE,
  },
  QuestionTitle: {
    paddingTop: '60@mvs',
    justifyContent: 'center',
    backgroundColor: 'yellowgreen',
  },
  QuestionBody: {
    minHeight:'100@mvs',
    backgroundColor: 'white',
  },
  MultipleChoiceAnswers: {
    flex:1,
    backgroundColor: 'yellowgreen',
  },
});

export default StudyScreen;
