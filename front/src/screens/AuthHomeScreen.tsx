import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import {Button, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../navigation/AuthStackNavigator';
import { authNavigation } from '../constants';

type AuthHomeScreenProps = StackScreenProps<AuthStackParamList>;

function AuthHomeScreen({navigation}:AuthHomeScreenProps) {
  return (
    <SafeAreaView>
      <View>
        <Button title="로그인 화면으로 이동" onPress={()=> navigation.navigate(authNavigation.LOGIN) }/>
      </View>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

export default AuthHomeScreen;
