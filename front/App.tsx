import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from './src/navigation/RootStackNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import useThemeStorage from './src/hooks/useThemeStorage';
import { colors } from './src/constants/colors';
// import { useBookmarkStore } from './src/store/useBookmarkStore';
import SplashScreen from 'react-native-splash-screen';
import { useAuthStore } from './src/store/useAuthStore';
import { initializeAuth } from './src/util/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function App(): React.JSX.Element {
  const { theme } = useThemeStorage();
  const { setLoggedIn } = useAuthStore();

  useEffect(() => {
    initializeAuth(setLoggedIn);
    // 북마크 로드와 함께 인증 초기화
    // useBookmarkStore.getState().loadBookmarks();

    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, [setLoggedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors[theme].WHITE}
      />
      <NavigationContainer>
        <RootStackNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
