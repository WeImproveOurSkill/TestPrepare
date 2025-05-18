import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from './src/navigation/RootStackNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import useThemeStorage from './src/hooks/useThemeStorage';
import { colors } from './src/constants/colors';
import { useBookmarkStore } from './src/store/useBookmarkStore';
import SplashScreen from 'react-native-splash-screen';

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
  const {theme} = useThemeStorage();

  useEffect(() => {
    useBookmarkStore.getState().loadBookmarks();
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
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
