import React from 'react';
import { Modal, View, Text, Pressable, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  explanation: string | null;
  isLoading: boolean;
  onRefetch: () => void;
}

const ExplanationModal = ({ isVisible, onClose, explanation, isLoading, onRefetch }: Props) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);

  // // 내부 상태로 explanation을 관리 (prop이 바뀔 때마다 초기화)
  // const [displayExplanation, setDisplayExplanation] = useState<string | null>(explanation);

  // useEffect(() => {
  //   setDisplayExplanation(explanation);
  // }, [explanation]);

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
            <View style={styles.modalContent}>
              {isLoading ? (
                <View style={styles.loadingWrapper}>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors[theme].MAIN} />
                  </View>
                </View>
              ) : (
                <View style={styles.questionExplanationContainer}>
                  <Text style={styles.explanationText}>{explanation || '해설이 없습니다.'}</Text>
                </View>
              )}
              <View>
                <Pressable onPress={onRefetch} style={styles.gptButton} disabled={isLoading}>
                  <Text style={styles.gptButtonText}>GPT 해설 다시 요청하기</Text>
                </Pressable>
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
    minHeight: '25%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: '20@mvs0.3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors[theme].WHITE,
    transform: [{ rotate: '0deg' }], // 회전 방지
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionExplanationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20@mvs0.3',
  },
  gptButton: {
    backgroundColor: colors[theme].MAIN,
    padding: '10@mvs0.3',
    borderRadius: '10@mvs0.3',
  },
  gptButtonText: {
    color: colors[theme].WHITE,
    fontSize: '16@mvs0.3',
  },
  loadingWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    backgroundColor: colors[theme].WHITE,
    padding: '15@mvs0.3',
    borderRadius: '10@mvs0.3',
    marginVertical: '10@mvs0.3',
  },
  explanationText: {
    color: colors[theme].BLACK,
    fontSize: '16@mvs0.3',
    fontWeight: 'bold',
  },
});

export default ExplanationModal;

// const [gptExplanation, setGptExplanation] = useState<string | null>(null);
  // const [hasRequestedExplanation, setHasRequestedExplanation] = useState(false);

  // // gpt 해설 요청을 위한 mutation 정의
  // const gptExplanationMutation = useMutation({
  //   mutationFn: async (data: any) => {
  //     const endpoint = 'recommend/gpt-assistance';
  //     return await fetchGPTPost(endpoint, data);
  //   },
  //   onSuccess: (response) => {
  //     if (response) {
  //       const explanationText = JSON.stringify(response);
  //       setGptExplanation(explanationText);
  //     } else {
  //       console.log('gpt 해설을 받아오는데 실패했습니다.');
  //     }
  //   },
  //   onError: (error: any) => {
  //     console.error('gpt 해설 요청 오류:', error);
  //   },
  // });

  // useEffect(() => {
  //   setGptExplanation(null);
  //   setHasRequestedExplanation(false);
  // }, [question]);


  // 직접 fetch API를 사용하는 POST 요청 함수
  // const gptExplanationMutation = {
  //   isPending: isLoading,
  //   mutate: async (requestData: any) => {
  //     try {
  //       setIsLoading(true);
  //       console.log(requestData);
  //       const response = await fetch('http://124.111.2.61/bf/recommend/gpt-assistance', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json',
  //         },
  //         body: JSON.stringify(requestData),
  //       });

  //       if (!response.ok) {
  //         console.error(`HTTP 오류: ${response.status}`);
  //         // setGptExplanation(JSON.stringify(errorExplanationText.explanation));
  //         return;
  //       }

  //       const data = await response.json();

  //       if (data) {
  //         const explanationText = JSON.stringify(data.explanation);
  //         console.log(data);
  //         console.log('explanationText:', explanationText);
  //         setGptExplanation(explanationText);
  //       }
  //     } catch (err) {
  //       console.error('GPT 해설 요청 오류:', err);
  //       // setGptExplanation(JSON.stringify(errorExplanationText.explanation));
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  // };


  // const handleGPTButton = () => {
  //   setHasRequestedExplanation(true);
  //   const requestData = {
  //     questionId: question.questionId,
  //     content: question.content,
  //     answer: question.answer,
  //     explanation: question.explanation,
  //     subjectName: subjectName,
  //   };
  //   console.log(requestData);
  //   gptExplanationMutation.mutate(requestData);
  // };
