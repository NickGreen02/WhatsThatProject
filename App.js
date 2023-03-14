import * as React from 'react';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import ChatlistScreen from './components/chatList';
import CreateChatScreen from './components/createChat'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home(){
  return(
    //add tab navigator for screens once logged in
    <Tab.Navigator screenOptions={{headerShown:false}}>
        <Tab.Screen name="Chats" component={ChatlistScreen}/>
        <Tab.Screen name="Add Chat" component={CreateChatScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    //add a navigation container containing all initial screens
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="MainAppNav" component={Home} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};