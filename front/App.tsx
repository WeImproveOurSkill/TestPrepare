import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './src/navigation/AuthStackNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { StatusBar } from 'react-native';

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

  return (
    // <StatusBar /> // 다크모드 적용시키기
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AuthStackNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
