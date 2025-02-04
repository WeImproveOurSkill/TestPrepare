import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  // SafeAreaView,
  // StyleSheet,
  // Text,
  // TextInput,
  // View,
} from 'react-native';
import AuthStackNavigator from './src/navigation/AuthStackNavigator';


function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      {/* <SafeAreaView style={styles.container}>
        <View style={styles.viewContainer}>
          <Text>안녕</Text>
          <TextInput style={styles.textContainer}/>
        </View>
      </SafeAreaView> */}
      <AuthStackNavigator />
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'red',
//     flex: 1,
//     // alignItems: 'center',
//     // justifyContent: 'center',
//     // height: '100%',
//   },
//   viewContainer: {
//     backgroundColor: 'yellow',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textContainer: {
//     backgroundColor: 'blue',
//     // flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default App;
