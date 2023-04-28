import React, { Component } from 'react';
import {
  View, Text, TextInput, StyleSheet,
} from 'react-native';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatScreenApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: {},
      messageToSend: '',
      isLoading: true,
      interval: null,
      errorstate: '',
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
    const intervalRefresh = setInterval(() => {
      this.getData();
      console.log('chatscreen interval refresh');
    }, 5000);
    this.setState({ interval: intervalRefresh });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    const { interval } = this.state;
    this.unsubscribe();
    this.refreshChats();
    clearInterval(interval);
  }

  async getData() {
    const { route } = this.props;
    const { chatID } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatID}`,
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
        } if (response.status === 404) {
          throw new Error('Not found');
        } if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((rJson) => {
        console.log(rJson);
        this.setState({ chat: rJson, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errorstate: error });
      });
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  async leaveChat() {
    const { route, navigation } = this.props;
    const { chatID } = route.params;
    const user = await AsyncStorage.getItem('whatsthat_user_id');
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatID}/user/${user}`,
      {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ChatList', { updateList: true });
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
        } if (response.status === 404) {
          throw new Error('Not found');
        } if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((rJson) => {
        console.log(rJson);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorstate: error });
      });
  }

  async send(messageText) {
    const { route } = this.props;
    const { chatID } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatID}/message`,
      {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
        }),
      },
    )
      .then((rJson) => {
        console.log(rJson);
        this.setState({ isLoading: true, messageToSend: '' });
        this.getData();
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorstate: error });
      });
  }

  async deleteMessage(messageID) {
    const { route } = this.props;
    const { chatID } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatID}/message/${messageID}`,
      {
        method: 'DELETE',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      },
    )
      .then((rJson) => {
        console.log(rJson);
        this.setState({ isLoading: true });
        this.getData();
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorstate: error });
      });
  }

  render() {
    const {
      chat,
      messageToSend,
      isLoading,
      errorstate,
    } = this.state;
    const { route, navigation } = this.props;
    const { userID, chatID } = route.params;
    console.log(userID);
    if (isLoading) {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <ActivityIndicator />
          </View>
        </View>
      );
    } else {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <View style={Styles.optionsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('ChatNameScreen', { chatId: chatID })}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Edit Chat Name</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AddChatUser', { chatJSON: chat, chatId: chatID })}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Add User To Chat</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('RemoveChatUser', { chatJSON: chat, chatId: chatID })}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Remove User</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.leaveChat()}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Leave Chat</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={Styles.listContainer}>
              <FlatList
                data={chat.messages}
                inverted
                renderItem={({ item }) => (
                  <View style={Styles.messageBubble}>
                    <View style={Styles.messageContainer}>
                      <View style={Styles.messageTextContainer}>
                        <Text style={Styles.messageAuthorText}>
                          {item.author.first_name}
                          {' '}
                          {item.author.last_name}
                        </Text>
                        <Text style={Styles.message}>{item.message}</Text>
                      </View>
                      <View style={Styles.messageOptionsContainer}>
                        <TouchableOpacity style={Styles.editMsgButton} onPress={() => navigation.navigate('EditMessageScreen', { messageId: item.message_id, chatId: chatID, initialMessageText: item.message })}>
                          <Text style={Styles.deleteButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles.deleteButton} onPress={() => this.deleteMessage(item.message_id)}>
                          <Text style={Styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.message_id}
              />
              <>
                {errorstate && <Text style={Styles.error}>{errorstate}</Text>}
              </>
            </View>
          </View>
          <View style={Styles.sendContainer}>
            <TextInput
              style={Styles.sendMessage}
              placeholder="Send a message..."
              onChangeText={(value) => { this.setState({ messageToSend: value }); }}
              defaultValue={messageToSend}
              multiline
            />
            <TouchableOpacity style={Styles.sendButton} onPress={() => this.send(messageToSend)}>
              <Text style={Styles.buttonText}>Send</Text>
            </TouchableOpacity>
            <>
              {errorstate && <Text style={Styles.error}>{errorstate}</Text>}
            </>
          </View>
        </View>
      );
    }
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
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#25D366',
    margin: 3,
    width: '20vw',
  },
  optionButtonText: {
    alignText: 'center',
    padding: 10,
    color: 'white',
  },
  listContainer: {
    flex: 1,
    marginBottom: '20vw',
  },
  messageBubble: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageTextContainer: {
    flexDirection: 'column',
  },
  messageAuthorText: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: 5,
  },
  message: {
    width: '60vw',
  },
  messageOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editMsgButton: {
    backgroundColor: '#25D366',
    justifyContent: 'center',
    width: '15vw',
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    width: '15vw',
  },
  deleteButtonText: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
  },
  sendContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  sendMessage: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    width: '75vw',
  },
  sendButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    margin: 5,
    width: '20vw',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});
