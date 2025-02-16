// src/styles/colors.ts

export type Colors = {
  primary: string;
  secondary: string;
  background: {
    default: string;
    grey: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
    white: string;
  };
  theme: {
    electricity: string;
    architecture: string;
    interior: string;
    default: string;
  };
  border: string;
  shadow: string;
  overlay: string;
};

const colors = {
  // 메인 컬러
  primary: '#FF984A',
  secondary: '#4A90E2',

  // 배경색
  background: {
    default: '#e1e1e1',
    white: '#FFFFFF',
    grey: '#F5F5F5',
    dark: '#333333',
  },

  // 텍스트 컬러
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
    white: '#FFFFFF',
  },

  // 테마 컬러 (자격증 별 색상)
  theme: {
    electricity: '#4A90E2',    // 전기 계열
    architecture: '#9B59B6',   // 건축 계열
    interior: '#2ECC71',       // 인테리어 계열
    default: '#2980B9',        // 기본 색상
  },

  // 상태 컬러
  status: {
    success: '#27AE60',
    warning: '#F1C40F',
    error: '#E74C3C',
    info: '#3498DB',
  },

  // 경계선 컬러
  border: '#E1E1E1',

  // 그림자 컬러
  shadow: 'rgba(0, 0, 0, 0.1)',

  // 모달 오버레이
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

// 타입 추출
export default colors;
