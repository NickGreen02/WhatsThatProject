import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ChatPreview from './chatPreview';

export default class ChatlistApp extends Component {
  constructor(props) {
    super(props);
    this.state = { chats: {} };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshChats = navigation.addListener('focus', () => {
      this.getData();
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.refreshChats();
  }

  async getData() {
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((rJson) => {
        console.log(rJson);
        this.setState({ chats: rJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  async logout() {
    console.log('Logout');
    const { navigation } = this.props;
    return fetch(
      'http://localhost:3333/api/1.0.0/logout',
      {
        method: 'POST',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          navigation.navigate('Login');
        } else if (response.status === 401) {
          console.log('Unauthorized');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          navigation.navigate('Login');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
        // eslint-disable-next-line react/no-unused-state
        this.setState({ submitted: false });
      });
  }

  render() {
    const { chats } = this.state;
    const { navigation } = this.props;
    return (
      <View style={Styles.container}>
        <View style={Styles.formContainer}>
          <View>
            <TouchableOpacity onPress={() => this.logout()}>
              <View style={Styles.button}>
                <Text style={Styles.buttonText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={chats}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { chatID: item.chat_id })}>
                <ChatPreview name={item.name} creatorName={item.creator.first_name} messagePreview={item.last_message.message} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.chat_id}
          />
        </View>
      </View>
    );
  }
}

// stylesheet for the page
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  formContainer: {
  },
  button: {
    backgroundColor: '#25D366',
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
