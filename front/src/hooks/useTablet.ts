import { useWindowDimensions } from 'react-native';

/**
 * 태블릿 디바이스 판단을 위한 너비 임계값
 * 화면 너비가 이 값 이상일 경우 태블릿으로 간주됩니다.
 */
export const TABLET_WIDTH_THRESHOLD = 650;

/**
 * 너비 값에 따라 태블릿 여부를 판단하는 함수
 * @param width - 화면 너비
 * @returns boolean - 태블릿 여부
 */
export const isTablet = (width: number): boolean => width >= TABLET_WIDTH_THRESHOLD;

/**
 * 현재 디바이스가 태블릿인지 확인하는 Hook
 * @returns boolean - 태블릿 여부
 */
export function useTablet(): boolean {
  const { width } = useWindowDimensions();
  return isTablet(width);
}

export default useTablet;
