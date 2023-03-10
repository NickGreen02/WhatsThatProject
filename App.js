import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import ChatlistScreen from './components/chatList';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    //add a navigation container containing all screens
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="MainAppNav" component={ChatlistScreen}/>  
      </Stack.Navigator>
    </NavigationContainer>
  );
};