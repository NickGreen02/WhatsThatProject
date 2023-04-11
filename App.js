import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import ChatlistScreen from './components/chatList';
import ChatScreen from './components/chatScreen';
import CreateChatScreen from './components/createChat';
import ContactScreen from './components/contactsList';
import BlockedScreen from './components/blockedList';
import ProfileScreen from './components/userProfile';
import YourProfileScreen from './components/yourProfile';
import ChatNameScreen from './components/chatName';
import UpdateProfile from './components/updateProfile';
import SearchScreen from './components/search';
import TakePhoto from './components/takePhoto';
import RemoveChatUser from './components/removeChatUser';
import EditMessage from './components/editMessage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const YourProfileStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

function ContactNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ContactScreen" component={ContactScreen} />
      <ProfileStack.Screen name="Blocked" component={BlockedScreen} options={{ headerShown: true }} />
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
      <ProfileStack.Screen name="Search" component={SearchScreen} options={{ headerShown: true }} />
    </ProfileStack.Navigator>
  );
}

function ChatAndYourProfileNav() {
  return (
    <YourProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <YourProfileStack.Screen name="ChatList" component={ChatlistScreen} />
      <YourProfileStack.Screen name="YourProfile" component={YourProfileScreen} options={{ headerShown: true }} />
      <YourProfileStack.Screen name="UpdateProfile" component={UpdateProfile} options={{ headerShown: true }} />
      <YourProfileStack.Screen name="TakePhoto" component={TakePhoto} options={{ headerShown: true }} />
    </YourProfileStack.Navigator>
  );
}

function ChatNav() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatAndUserProfile" component={ChatAndYourProfileNav} />
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: true }} />
      <ChatStack.Screen name="ChatNameScreen" component={ChatNameScreen} options={{ headerShown: true }} />
      <ChatStack.Screen name="RemoveChatUser" component={RemoveChatUser} options={{ headerShown: true }} />
      <ChatStack.Screen name="EditMessageScreen" component={EditMessage} options={{ headerShown: true }} />
    </ChatStack.Navigator>
  );
}

function Home() {
  return (
    // add tab navigator for screens once logged in
    <Tab.Navigator initialRouteName="Chats" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Chats" component={ChatNav} />
      <Tab.Screen name="Add Chat" component={CreateChatScreen} />
      <Tab.Screen name="Contacts" component={ContactNav} />
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
