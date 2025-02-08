import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// 디바이스 종류(iOS/Android, iPad/iPhone)와 화면 높이에 따라 헤더의 marginTop 값을 반환하는 함수
const getHeaderMarginTop = (): number => {
  // Android면 marginTop 없이 0 반환
  if (Platform.OS !== 'ios') {return 0;}

  const { height } = Dimensions.get('window');

  // iPad인 경우 (tablet이면) 16 적용
  if (DeviceInfo.isTablet()) {return 16;}

  // iOS의 일반 아이폰과 작은 아이폰 (예: iPhone SE) 구분
  // 임계값(여기서는 700dp)을 넘으면 일반 아이폰으로 간주하여 44, 아니면 16을 적용
  return height >= 670 ? 44 : 16;
};

export default getHeaderMarginTop;
