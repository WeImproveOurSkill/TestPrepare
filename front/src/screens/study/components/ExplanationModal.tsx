import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
// import { useMutation } from '@tanstack/react-query';
// import { fetchPost } from '../../../util/api';
import { QuestionData } from '../../../screens/components/QuestionItem';
import useThemeStore, { themeMode } from '../../../store/useThemeStore';
import { colors } from '../../../constants/colors';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  question: QuestionData;
}

const ExplanationModal = ({ isVisible, onClose, question }: Props) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const [perplexityExplanation, setPerplexityExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perplexity 해설 요청을 위한 mutation 정의
  /*
  const perplexityExplanationMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = '/recommend/perplexity-assistance';
      return await fetchPost(endpoint, data);
    },
    onSuccess: (response) => {
      if (response) {
        const explanationText = JSON.stringify(response);
        setPerplexityExplanation(explanationText);
      } else {
        console.log('Perplexity 해설을 받아오는데 실패했습니다.');
      }
    },
    onError: (error: any) => {
      console.error('Perplexity 해설 요청 오류:', error);
    },
  });
  */

  // 직접 fetch API를 사용하는 POST 요청 함수
  const perplexityExplanationMutation = {
    isPending: isLoading,
    mutate: async (requestData: any) => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(requestData);
        const response = await fetch('http://124.111.2.61:8000/recommend/perplexity-assistance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP 오류: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          const explanationText = JSON.stringify(data);
          setPerplexityExplanation(explanationText);
        } else {
          setError('Perplexity 해설을 받아오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('Perplexity 해설 요청 오류:', err);
        setError(`Perplexity 해설 요청 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      } finally {
        setIsLoading(false);
      }
    },
  };
  console.log(error);

  const handlePerplexityButton = () => {
    const requestData = {
      questionId: question.questionId,
      content: question.content,
      answer: question.answer,
      explanation: question.explanation,
      subjectName: '소프트웨어 공학',
    };
    console.log(requestData);
    perplexityExplanationMutation.mutate(requestData);
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
                <Pressable onPress={handlePerplexityButton} style={styles.gptButton} disabled={perplexityExplanationMutation.isPending}>
                  <Text style={styles.gptButtonText}>Perplexity 해설 요청하기</Text>
                </Pressable>
              {perplexityExplanationMutation.isPending ? (
                <View style={styles.loadingWrapper}>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors[theme].MAIN} />
                  </View>
                  <Text style={styles.loadingText}>Perplexity 해설 요청 중...</Text>
                  <Text style={styles.loadingText}>Perplexity 해설 요청은 시간이 소요될 수 있습니다.</Text>
                  <Text style={styles.loadingText}>(약 20초~30초 소요)</Text>
                </View>
              ) : (
                // ''
                <Text style={styles.explanationText}>{perplexityExplanation}</Text>
              )}
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
    height: '60%',
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
    backgroundColor: colors[theme].WHITE,
    height: '100%',
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
    borderWidth: 1,
    borderColor: colors[theme].MAIN,
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
});

export default ExplanationModal;
