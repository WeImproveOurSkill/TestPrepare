const authNavigation = {
  AUTH_HOME: 'AuthHome',
  LOGIN: 'Login',
  HOME: 'Home',
  EXAM: 'Exam',
  STUDY: 'Study',
  QUIZ: 'Quiz',
  BottomTabNavigator: 'BottomTabNavigator',
} as const;

const BottomTabNavigation = {
  HOME: 'Home',
  EXAM: 'Exam',
  STUDY: 'Study',
  QUIZ: 'Quiz',
} as const;

export { authNavigation, BottomTabNavigation };
