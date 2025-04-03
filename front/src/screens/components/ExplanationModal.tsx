import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
// import { useMutation } from '@tanstack/react-query';
// import { fetchPost } from '../../../util/api';
import { QuestionData } from './QuestionItem';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  question: QuestionData;
  subjectName: string;
}

// const errorExplanationText = {
//   'explanation': '정답이 ③인 이유는 워크스루와 인스펙션이 서로 다른 의미를 가졌기 때문입니다. 워크스루는 팀 구성원들이 참여하여 문서나 코드를 검토하고 피드백을 주고받는 방법으로, 팀 내 의사소통과 이해를 높이는 데 중점을 둡니다. 반면, 인스펙션은 코드나 문서 작성자를 제외한 전문가들이 엄격한 절차에 따라 객관적으로 검토하는 방법입니다. 따라서 두 개념은 동일하지 않습니다.',
// };

const ExplanationModal = ({ isVisible, onClose, question, subjectName }: Props) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const [gptExplanation, setGptExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequestedExplanation, setHasRequestedExplanation] = useState(false);
  // console.log(errorExplanationText.explanation);

  // gpt 해설 요청을 위한 mutation 정의
  /*
  const gptExplanationMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = '/recommend/gpt-assistance';
      return await fetchPost(endpoint, data);
    },
    onSuccess: (response) => {
      if (response) {
        const explanationText = JSON.stringify(response);
        setGptExplanation(explanationText);
      } else {
        console.log('gpt 해설을 받아오는데 실패했습니다.');
      }
    },
    onError: (error: any) => {
      console.error('gpt 해설 요청 오류:', error);
    },
  });
  */

  useEffect(() => {
    setGptExplanation(null);
    setHasRequestedExplanation(false);
    setIsLoading(false);
  }, [question]);


  // 직접 fetch API를 사용하는 POST 요청 함수
  const gptExplanationMutation = {
    isPending: isLoading,
    mutate: async (requestData: any) => {
      try {
        setIsLoading(true);
        console.log(requestData);
        const response = await fetch('http://124.111.2.61:8000/recommend/gpt-assistance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          console.error(`HTTP 오류: ${response.status}`);
          // setGptExplanation(JSON.stringify(errorExplanationText.explanation));
          return;
        }

        const data = await response.json();

        if (data) {
          const explanationText = JSON.stringify(data.explanation);
          console.log(data);
          console.log('explanationText:', explanationText);
          setGptExplanation(explanationText);
        }
      } catch (err) {
        console.error('GPT 해설 요청 오류:', err);
        // setGptExplanation(JSON.stringify(errorExplanationText.explanation));
      } finally {
        setIsLoading(false);
      }
    },
  };


  const handleGPTButton = () => {
    setHasRequestedExplanation(true);
    const requestData = {
      questionId: question.questionId,
      content: question.content,
      answer: question.answer,
      explanation: question.explanation,
      subjectName: subjectName,
    };
    console.log(requestData);
    gptExplanationMutation.mutate(requestData);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        supportedOrientations={['portrait', 'landscape', 'portrait-upside-down', 'landscape-left', 'landscape-right']}
      >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
            <View style={styles.modalContent}>
             <View style={styles.questionExplanationContainer}>
                <Text style={styles.explanationText}>{question?.explanation || '해설이 없습니다.'}</Text>
              </View>

              <View style={styles.gptButtonContainer}>
                {!hasRequestedExplanation && (
                  <Pressable onPress={handleGPTButton} style={styles.gptButton} disabled={gptExplanationMutation.isPending}>
                    <Text style={styles.gptButtonText}>GPT 해설 요청하기</Text>
                  </Pressable>
                )}
              {gptExplanationMutation.isPending ? (
                <View style={styles.loadingWrapper}>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors[theme].MAIN} />
                  </View>

                  <Text style={styles.loadingText}>GPT 해설 요청 중...</Text>
                  <Text style={styles.loadingText}>GPT 해설 요청은 시간이 소요될 수 있습니다.</Text>
                  <Text style={styles.loadingText}>(약 10초~20초 소요)</Text>
                </View>
              ) : (
                hasRequestedExplanation && gptExplanation && (
                  <Text style={styles.explanationText}>
                    {gptExplanation}
                  </Text>
                )
              )}
              </View>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // 모달이 화면 아래에서 시작
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalContainer: {
    minHeight: '30%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors[theme].WHITE,
    alignSelf: 'center',
    transform: [{ rotate: '0deg' }], // 회전 방지
  },
  modalContent: {
    // height: '100%',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionExplanationContainer: {
    width: '100%',
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: 1,
    // borderColor: colors[theme].MAIN,
    paddingBottom: '20@mvs0.3',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: colors[theme].WHITE,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors[theme].MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: '16@mvs',
    fontWeight: 'bold',
    color: colors[theme].MAIN,
  },
  gptButton: {
    backgroundColor: colors[theme].MAIN,
    padding: '10@mvs0.3',
    borderRadius: '10@mvs0.3',
    marginTop: '30@mvs0.3',
  },
  gptButtonText: {
    color: colors[theme].WHITE,
    fontSize: '16@mvs0.3',
  },
  loadingWrapper: {
    width: '100%',
    marginTop: '20@mvs0.3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: colors[theme].WHITE,
    padding: '15@mvs0.3',
    borderRadius: 10,
    marginTop: '10@mvs0.3',
    marginBottom: '10@mvs0.3',
  },
  explanationText: {
    color: colors[theme].BLACK,
    fontSize: '16@mvs0.3',
    fontWeight: 'bold',
  },
  loadingText: {
    color: colors[theme].BLACK,
    fontSize: '12@mvs0.3',
    marginVertical: '4@mvs0.3',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: '14@mvs0.3',
    marginTop: '10@mvs0.3',
    textAlign: 'center',
  },
  gptButtonContainer: {
    width: '100%',
    // marginTop: '20@mvs0.3',
    // alignItems: 'center',
    // justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: colors[theme].MAIN,
  },
});

export default ExplanationModal;
