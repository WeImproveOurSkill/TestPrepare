import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './src/navigation/AuthStackNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';


function App(): React.JSX.Element {

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AuthStackNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
