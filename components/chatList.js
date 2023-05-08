import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ActivityIndicator,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import chat preview component for listing each chat
import ChatPreview from './chatPreview';

export default class ChatlistApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: {},
      user: '',
      isLoading: true,
      interval: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshChats = navigation.addListener('focus', () => {
      this.getData();
    });
    // refresh the chat list every 5 seconds so that any new message shows in the last message preview
    const intervalRefresh = setInterval(() => {
      this.getData();
      console.log('chatlist interval refresh');
    }, 5000);
    this.setState({ interval: intervalRefresh });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    const { interval } = this.state;
    this.unsubscribe();
    this.refreshChats();
    // stop the refreshing
    clearInterval(interval);
  }

  // get the list of chats with relevant info
  async getData() {
    const { route } = this.props;
    // if chat list has changed (if logged in user has left chat) set isLoading to true
    try {
      const { updateList } = route.params;
      if (updateList === true) {
        this.setState({ isLoading: true });
      }
    } catch (error) {
      this.setState({ isLoading: false });
    }
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
        this.setState({ chats: rJson, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // logout function
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
        // if logout successful, remove token and user id from storage
        if (response.status === 200) {
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          await AsyncStorage.removeItem('whatsthat_draft_messages');
          navigation.navigate('Login');
        } else if (response.status === 401) {
          console.log('Unauthorized');
          await AsyncStorage.removeItem('whatsthat_session_token');
          await AsyncStorage.removeItem('whatsthat_user_id');
          await AsyncStorage.removeItem('whatsthat_draft_messages');
          navigation.navigate('Login');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { chats, user, isLoading } = this.state;
    const { navigation } = this.props;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else { // render chat list with button for navigation to each chat, user's profile page, and a logout button
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('YourProfile')}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionButtonText}>Your Profile</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.logout()}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionButtonText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={chats}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { chatID: item.chat_id, userID: user })}>
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
}

// stylesheet for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  formContainer: {
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#25D366',
    margin: 5,
    width: '45vw',
  },
  optionButtonText: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
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
