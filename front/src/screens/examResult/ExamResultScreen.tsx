import React, { useEffect } from 'react';
import { Pressable, Text, View, ScrollView, Alert } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useSubjectStore } from '../../store/useSubjectStore';

interface Props {
  route: {
    params: {
      userAnswers:
      {
        questionId: number;
        answer: string;
        userAnswer: string;
      }[];
      year: number;
      session: number;
    }
  };
}

function ExamResultScreen({ route }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  // const isTablet = useTablet();
  const {theme} = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const { userAnswers, year, session } = route.params;

  const subjects = useSubjectStore((state) => state.subjects);
  const currentSubjectId = useSubjectStore((state) => state.currentSubjectId);
  const currentCertificationId = useSubjectStore((state) => state.currentCertificationId);
  const setCurrentExamContext = useSubjectStore((state) => state.setCurrentExamContext);
  const addSolvedSubject = useSubjectStore((state) => state.addSolvedSubject);
  const resetSolvedSubjects = useSubjectStore((state) => state.resetSolvedSubjects);
  const solvedSubjects = useSubjectStore((state) => state.solvedSubjects);


  const userAnswersWithIsCorrect = userAnswers.map(answer => ({
    ...answer,
    isCorrect: answer.userAnswer === answer.answer,
  }));

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSelectLicense = () => {
    Alert.alert('알림', '시험을 종료하시겠습니까?', [
      {
        text: '아니오',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '예',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTab' }],
          });
        },
      },
    ]);
  };

  // 회차키 생성 함수
const getExamKey = (certificationId: number, year: number, session: number) =>
  `${certificationId}_${year}_${session}`;

// 진입 시 현재 과목을 푼 과목으로 기록
useEffect(() => {
  if (currentCertificationId && currentSubjectId) {
    addSolvedSubject(getExamKey(currentCertificationId, year, session), currentSubjectId);
  }
}, [currentCertificationId, currentSubjectId, year, session, addSolvedSubject]);

const handleNavigateToNextSubjectOrLoop = () => {
  if (currentCertificationId === null || currentSubjectId === null) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTab' }],
    });
    return;
  }

  const subjectList = subjects[currentCertificationId];
  if (!subjectList || subjectList.length === 0) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTab' }],
    });
    return;
  }

  const examKey = getExamKey(currentCertificationId, year, session);
  const solved = solvedSubjects[examKey] || [];

  // 아직 안 푼 과목만 필터링
  const unsolvedSubjects = subjectList.filter(subj => !solved.includes(subj.subjectId));
  if (unsolvedSubjects.length === 0) {
    // 모든 과목 풀이 완료 안내
    Alert.alert('알림', '해당 회차의 모든 과목 시험을 완료했습니다!');
    resetSolvedSubjects(examKey);
    return;
  }

  // 현재 과목이 unsolvedSubjects에 없으면, unsolvedSubjects[0]로 이동
  let nextSubject =
    unsolvedSubjects.find(subj => subj.subjectId > currentSubjectId) || unsolvedSubjects[0];

  setCurrentExamContext({
    subjectId: nextSubject.subjectId,
    subjectName: nextSubject.subjectName,
    certificationId: currentCertificationId,
  });

  navigation.navigate('QuestionPager', {
    subjectId: nextSubject.subjectId,
    subjectName: nextSubject.subjectName,
    certificationId: currentCertificationId,
    mode: 'exam',
    year,
    session,
  });
};

  return (
    <View style={[styles.container, {
           paddingTop: insets.top,
           paddingLeft: insets.left,
           paddingRight: insets.right,
         }]}>
      <View style={styles.headerButtonContainer}>
        <Pressable onPress={handleGoBack}>
          <MaterialIcons name="arrow-back-ios" style={styles.backIcon} />
        </Pressable>
        <Pressable onPress={handleSelectLicense}>
          <Text style={styles.closeIcon}>×</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.contentContainer}>
        {userAnswersWithIsCorrect?.map((userAnswer, index) => (
          <View key={index} style={styles.questionContainer}>
            {userAnswer.isCorrect ? (
              <EntypoIcons name="circle" style={styles.correctIcon} />
            ) : (
              <EntypoIcons name="circle-with-cross" style={styles.incorrectIcon} />
            )}
            <Text style={styles.questionResult}>{index + 1 + '.'}</Text>
            <Text style={styles.questionResult}>{'선택한 답 : ' + userAnswer.userAnswer}</Text>
            <Text style={styles.questionResult}>{'정답 : ' + userAnswer.answer}</Text>
          </View>
        ))}
      </ScrollView>
      <Pressable style={styles.ButtonContainer} onPress={handleNavigateToNextSubjectOrLoop}>
        <Text style={styles.buttonText}>다음 과목 시험</Text>
      </Pressable>
    </View>
  );
}

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors[theme].WHITE,
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    // alignItems: 'center',
  },
  headerButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors[theme].GRAY_300,
  },
  backIcon: {
    color: colors[theme].MAIN,
    fontSize: '24@mvs0.3',
    padding: '16@mvs',
  },
  closeIcon: {
    color: colors[theme].MAIN,
    fontSize: '38@mvs0.3',
    paddingHorizontal: '12@mvs',
  },
  correctIcon: {
    color: colors[theme].GREEN_300,
    fontSize: '24@mvs0.3',
  },
  incorrectIcon: {
    color: colors[theme].RED_500,
    fontSize: '24@mvs0.3',
  },
  ButtonContainer: {
    position: 'absolute',
    bottom: insets.bottom > 0 ? '40@mvs' : '24@mvs',
    right: '24@ms',
    backgroundColor: colors[theme].MAIN,
    padding: '12@ms',
    borderRadius: '8@ms',
    zIndex: 1,
  },
  buttonText: {
    color: colors[theme].WHITE,
  },
  questionContainer: {
    width: '100%',
    // height: '30@mvs',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16@mvs',
    borderBottomWidth: 1,
    borderBottomColor: colors[theme].GRAY_300,
  },
  questionResult: {
    fontSize: '20@mvs',
    paddingLeft: '8@mvs',
    color: colors[theme].BLACK,
  },
});

export default ExamResultScreen;
