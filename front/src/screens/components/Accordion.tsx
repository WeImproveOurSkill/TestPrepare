import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { ScaledSheet } from 'react-native-size-matters';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
}) => {
  const { theme } = useThemeStore();
  const styles = styling(theme);
  const [expanded, setExpanded] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);  // 실제 컨텐츠 높이 저장

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(expanded ? contentHeight : 0, { duration: 300 }),
    opacity: withTiming(expanded ? 1 : 0, { duration: 300 }),
    overflow: 'hidden',
  }));

  const toggleAccordion = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const onLayout = useCallback((event: any) => {
    const layoutHeight = event.nativeEvent.layout.height;
    setContentHeight(layoutHeight);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.titleContainer}>
        <Text style={styles.arrow}>{expanded ? '▼' : '▲'}</Text>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* 높이 측정을 위한 숨겨진 View - 렌더링은 항상 진행 */}
        <View
          style={styles.layout}
          onLayout={onLayout}
        >
          {children}
        </View>
        {/* 실제 표시될 View - 내용물만 있음 */}
        <View style={styles.scrollContent}
        // onLayout={onLayout}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styling = (theme: themeMode) => ScaledSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: colors[theme].GRAY_300,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '10@ms',
  },
  arrow: {
    color: colors[theme].BLACK,
    fontSize: '20@ms',
    fontWeight: 'bold',
  },
  title: {
    color: colors[theme].BLACK,
    fontSize: '16@ms',
    fontWeight: '400',
    marginLeft: '10@ms',
    flex: 1,
  },
  content: {
    overflow: 'hidden',
  },
  layout: {
    position: 'absolute',
    opacity: 0,
  },
  scrollContent: {
    width: '100%',
  },
});

export default Accordion;
