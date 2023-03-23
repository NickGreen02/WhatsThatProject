import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';

import ChatlistScreen from './components/chatList';
import CreateChatScreen from './components/createChat';
import ContactScreen from './components/contactsList';

import ProfileScreen from './components/userProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ContactScreen" component={ContactScreen} />
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
    </ProfileStack.Navigator>
  );
}

function Home() {
  return (
    // add tab navigator for screens once logged in
    <Tab.Navigator initialRouteName="Chats" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Chats" component={ChatlistScreen} />
      <Tab.Screen name="Add Chat" component={CreateChatScreen} />
      <Tab.Screen name="Contacts" component={ProfileNav} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    // add a navigation container containing all initial screens
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainAppNav" component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
