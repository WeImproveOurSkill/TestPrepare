import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGet } from '../util/api';
import { QuestionData } from '../screens/components/QuestionItem';

type UseExamLogicProps = {
  subjectId?: number;
  year: number;
  session: number;
  currentPage?: number;
  handlePageChange?: (page: number) => void;
};

export const useExamLogic = ({
  subjectId,
  year,
  session,
  currentPage = 1,
  handlePageChange: externalHandlePageChange,
}: UseExamLogicProps) => {
  // 실제 렌더링에 사용할 문제 목록 상태
  const [displayQuestions, setDisplayQuestions] = useState<QuestionData[]>([]);
  // 현재 페이지 인덱스 상태
  const [currentIndex, setCurrentIndex] = useState(currentPage ? currentPage - 1 : 0);
  // 초기 로드 상태 추적 (useRef 대신 useState 사용)
  const [isInitialized, setIsInitialized] = useState(false);

  // 서버에서 문제 목록을 가져옴
  const { data: questionList, refetch: fetchNextQuestionsList } = useQuery({
    queryKey: ['questions', 'exam', subjectId, year, session],
    queryFn: async () => {
      return await fetchGet<QuestionData[]>(`exam/subject/${subjectId}/year/${year}/session/${session}`);
    },
    enabled: !!subjectId, // subjectId가 있을 때만 쿼리 활성화
  });

  // questionsList 데이터 처리 - 초기 로드 및 데이터 업데이트 통합
  useEffect(() => {
    if (questionList && Array.isArray(questionList) && questionList.length > 0) {
      if (!isInitialized) {
        // 초기 로드
        setDisplayQuestions(questionList);
        setIsInitialized(true);
      } else {
        // 이후 추가 데이터: 중복 제거 로직 추가
        setDisplayQuestions(prev => {
          // 기존 문제 ID Set 생성
          const existingIds = new Set(prev.map(q => q.questionId));
          // 새로운 문제 목록에서 중복되지 않은 문제만 필터링
          const uniqueNewQuestions = questionList.filter(q => !existingIds.has(q.questionId));
          // 기존 문제 목록과 중복되지 않은 새 문제 목록 병합
          return [...prev, ...uniqueNewQuestions];
        });
      }
    }
  }, [questionList, isInitialized]);

  // 현재 페이지 변경 처리 - useCallback으로 메모이제이션
  const handleInternalPageChange = useCallback((page: number) => {
    setCurrentIndex(page);

    if (externalHandlePageChange) {
      externalHandlePageChange(page);
    }

    if (page === displayQuestions.length) {
      fetchNextQuestionsList();
    }
  }, [externalHandlePageChange, displayQuestions.length, fetchNextQuestionsList]);

  return {
    displayQuestions,
    currentIndex,
    handlePageChange: handleInternalPageChange,
  };
};
