import React, { useEffect, useRef } from 'react';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { ScaledSheet } from 'react-native-size-matters';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

type CustomPagerViewProps = {
  children: React.ReactNode;
  currentPage?: number;
  onPageSelected?: ((page: number) => void) | ((e: any) => void);
  pagerRef?: React.RefObject<PagerView>;
  enableAnimation?: boolean;
  scrollEnabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  initialPage?: number;
};

function CustomPagerView({
  children,
  currentPage,
  onPageSelected,
  pagerRef: externalRef,
  enableAnimation = false,
  scrollEnabled = true,
  orientation = 'vertical',
  initialPage = 0,
}: CustomPagerViewProps) {
  const offset = useSharedValue(0);
  const internalRef = useRef<PagerView>(null);
  const actualRef = externalRef || internalRef;

  // currentPage가 변경되면 페이지 업데이트
  useEffect(() => {
    if (currentPage !== undefined && actualRef.current) {
      actualRef.current.setPage(currentPage);
    }
  }, [currentPage, actualRef]);

  const handlePageScroll = (e: any) => {
    if (enableAnimation) {
      offset.value = withSpring(e.nativeEvent.offset);
    }
  };

  const handlePageSelected = (e: any) => {
    if (onPageSelected) {
      // 함수 시그니처에 따라 다르게 처리
      if (onPageSelected.length === 1 && typeof onPageSelected === 'function') {
        // 페이지 번호만 전달하는 경우
        (onPageSelected as (page: number) => void)(e.nativeEvent.position);
      } else {
        // 전체 이벤트 객체를 전달하는 경우
        (onPageSelected as (e: any) => void)(e);
      }
    }
  };

  return (
    <AnimatedPagerView
      ref={actualRef}
      style={styles.content}
      initialPage={initialPage}
      orientation={orientation}
      onPageScroll={handlePageScroll}
      onPageSelected={handlePageSelected}
      scrollEnabled={scrollEnabled}
    >
      {children}
    </AnimatedPagerView>
  );
}

const styles = ScaledSheet.create({
  content: {
    flex: 1,
  },
});

export default CustomPagerView;
