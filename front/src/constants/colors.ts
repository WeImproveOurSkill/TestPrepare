const common = {
  MAIN: '#FF984A',
  PINK_200: '#FAE2E9',
  PINK_400: '#EC87A5',
  PINK_500: '#BF5C79',
  PINK_700: '#C63B64',
  BLUE_500: '#0D8AFF',
  RED_500: '#FF5F5F',
  RED_300: '#FFB4B4',
  BLUE_400: '#B4E0FF',
  GREEN_400: '#CCE6BA',
  YELLOW_300: '#FFE594',
  YELLOW_400: '#FEE500',
  YELLOW_500: '#FACC15',
  PURPLE_400: '#C4C4E7',
  UNCHANGE_WHITE: '#FFF',
  UNCHANGE_BLACK: '#000',
  electricity: '#4A90E2', // 파란색
  architecture: '#9B59B6', // 보라색
  interior: '#2ECC71', // 초록색
  default: '#2980B9', // 청록색
};
const colors = {
  light: {
    WHITE: '#FFF',
    GRAY_50: '#E7E7E7',
    GRAY_100: '#F8F8F8',
    GRAY_150: '#EFEFEF',
    GRAY_200: '#E7E7E7',
    GRAY_250: '#DEDEDE',
    GRAY_300: '#D8D8D8',
    GRAY_350: '#C4C4C4',
    GRAY_400: '#B0B0B0',
    GRAY_450: '#A0A0A0',
    GRAY_500: '#8E8E8E',
    GRAY_550: '#7A7A7A',
    GRAY_600: '#686868',
    GRAY_650: '#626262',
    GRAY_700: '#575757',
    BLACK: '#161616',
    ...common,
  },
  dark: {
    WHITE: '#161616',
    GRAY_50: '#575757',
    GRAY_100: '#626262',
    GRAY_150: '#686868',
    GRAY_200: '#7A7A7A',
    GRAY_250: '#8E8E8E',
    GRAY_300: '#A0A0A0',
    GRAY_350: '#B0B0B0',
    GRAY_400: '#C4C4C4',
    GRAY_450: '#D8D8D8',
    GRAY_500: '#DEDEDE',
    GRAY_550: '#E7E7E7',
    GRAY_600: '#EFEFEF',
    GRAY_650: '#F8F8F8',
    GRAY_700: '#FCFCFC',
    BLACK: '#FFF',
    ...common,
  },
} as const;

const colorHex = {
  RED: colors.light.PINK_400,
  BLUE: colors.light.BLUE_400,
  GREEN: colors.light.GREEN_400,
  YELLOW: colors.light.YELLOW_400,
  PURPLE: colors.light.PURPLE_400,
} as const;

// const license = {
//   electricity: '#4A90E2', // 파란색
//   architecture: '#9B59B6', // 보라색
//   interior: '#2ECC71', // 초록색
//   default: '#2980B9', // 청록색
// } as const;

export {colors, colorHex};
