/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function App(): React.JSX.Element {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewContainer}>
        <Text>안녕</Text>
        <TextInput style={styles.textContainer}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // height: '100%',
  },
  viewContainer: {
    backgroundColor: 'yellow',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: 'blue',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
