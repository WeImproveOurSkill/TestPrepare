import { create } from 'zustand';

export interface Subject {
  subjectId: number;
  subjectName: string;
}

interface SubjectState {
  // certificationId를 키로 사용하여 과목 목록 저장
  subjects: Record<number, Subject[]>;
  // 특정 certificationId의 과목 데이터를 스토어에 저장하는 액션
  setSubjects: (certificationId: number, fetchedSubjects: Subject[]) => void;
  // 현재 시험 컨텍스트 상태 추가
  currentSubjectId: number | null;
  currentSubjectName: string | null;
  currentCertificationId: number | null;
  // 현재 시험 컨텍스트를 설정하는 액션 추가
  setCurrentExamContext: (context: {
    subjectId: number;
    subjectName: string;
    certificationId: number;
  }) => void;
  solvedSubjects: Record<string, number[]>; // 회차별 푼 과목 목록
  addSolvedSubject: (key: string, subjectId: number) => void;
  resetSolvedSubjects: (key: string) => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: {},
  // setSubjects 액션 구현: 기존 상태를 복사하고 새로운 데이터를 추가/업데이트
  setSubjects: (certificationId, fetchedSubjects) => {
    set((state) => ({
      subjects: { ...state.subjects, [certificationId]: fetchedSubjects },
    }));
  },
  // 초기 상태 설정
  currentSubjectId: null,
  currentSubjectName: null,
  currentCertificationId: null,
  // 액션 구현
  setCurrentExamContext: (context) => {
    set({
      currentSubjectId: context.subjectId,
      currentSubjectName: context.subjectName,
      currentCertificationId: context.certificationId,
    });
  },
  solvedSubjects: {},
  addSolvedSubject: (key, subjectId) => set((state) => {
    const prev = state.solvedSubjects[key] || [];
    // 중복 방지
    if (prev.includes(subjectId)) {return {};}
    return { solvedSubjects: { ...state.solvedSubjects, [key]: [...prev, subjectId] } };
  }),
  resetSolvedSubjects: (key) => set((state) => ({
    solvedSubjects: { ...state.solvedSubjects, [key]: [] },
  })),
}));
