import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './src/navigation/AuthStackNavigator';
// import { StatusBar } from 'react-native';


function App(): React.JSX.Element {

  return (
    // <StatusBar /> // 다크모드 적용시키기
      <NavigationContainer>
        <AuthStackNavigator />
      </NavigationContainer>
  );
}

export default App;
