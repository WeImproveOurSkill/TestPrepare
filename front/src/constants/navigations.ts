const HomeStackNavigator = {
  EXAM: 'Exam',
  STUDY: 'Study',
  MAIN_TAB_NAVIGATOR: 'MainTabNavigator',
  QUESTION_PAGER: 'QuestionPagerScreen',
} as const;

const MainTabNavigation = {
  HOME: 'TabHome',
  WRONG_QUESTION_TAB: 'WrongQuestionTab',
  BOOKMARK_TAB: 'BookmarkTab',
  MYPAGE: 'MyPage',
} as const;

const RootStackNavigator = {
  AUTH_HOME: 'AuthHome',
  LOGIN: 'Login',
  HOME_STACK: 'StackHome',
  SELECT_CERTIFICATION: 'SelectCertification',
} as const;

export { HomeStackNavigator, MainTabNavigation, RootStackNavigator };

