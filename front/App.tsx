import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from './src/navigation/RootStackNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import useThemeStorage from './src/hooks/useThemeStorage';
import { colors } from './src/constants/colors';
import { useBookmarkStore } from './src/store/useBookmarkStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // 기본 캐시 시간 설정
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});


function App(): React.JSX.Element {
  const {theme} = useThemeStorage();

  useEffect(() => {
    useBookmarkStore.getState().loadBookmarks();
  }, []);

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
