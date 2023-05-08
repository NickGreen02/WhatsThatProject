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
      draftMessages: [],
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
    // refresh the chat every 5 seconds so that any new message shows
    const intervalRefresh = setInterval(() => {
      this.getData();
      console.log('chatscreen interval refresh');
    }, 5000);
    this.setState({ interval: intervalRefresh });
    AsyncStorage.getItem('whatsthat_draft_messages')
      .then((response) => {
        if (!(response === '' || response === null)) {
          this.setState({draftMessages: JSON.parse(response) });
        }
      });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    const { interval } = this.state;
    this.unsubscribe();
    this.refreshChats();
    // stop the refreshing
    clearInterval(interval);
  }

  // get the chat data
  async getData() {
    // get which chat id to request data of, from navigation params
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

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // leave chat function - remove logged in user from chat
  async leaveChat() {
    // get chat id from navigation params and user id from asyncstorarge
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
          // navigate to chat list once left chat with updateList param set to true to update chat list
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

  // send message function
  async send(messageText) {
    const { route } = this.props;
    const { chatID } = route.params;
    // send message request with message text from state sent as body
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
        // set message to send to empty string so textinput is cleared after message sent
        this.setState({ isLoading: true, messageToSend: '' });
        this.getData();
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorstate: error });
      });
  }

  saveDraft(messageText) {
    const { draftMessages } = this.state;
    let arr = draftMessages;
    arr.push({ draft: messageText });
    this.setState({ draftMessages: arr });
    this.saveDraftsToStorage();
  }

  saveDraftsToStorage() {
    const { draftMessages } = this.state;
    const drafts = JSON.stringify(draftMessages);
    AsyncStorage.setItem('whatsthat_draft_messages', drafts);
  }

  // delete message function
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

  // render chat screen with messages, textinput and option buttons
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
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <ActivityIndicator />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.optionsContainer}>
              { /* option buttons for change chat name, add user to chat, remove user, leave chat */ }
              <TouchableOpacity onPress={() => navigation.navigate('DraftsList', { chatId: chatID })}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionButtonText}>View Drafts</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ChatNameScreen', { chatId: chatID })}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionButtonText}>Edit Chat Name</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AddChatUser', { chatJSON: chat, chatId: chatID })}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionButtonText}>Add User</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('RemoveChatUser', { chatJSON: chat, chatId: chatID })}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionButtonText}>Remove User</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.leaveChat()}>
                <View style={styles.optionButton}>
                  <Text style={styles.optionButtonText}>Leave Chat</Text>
                </View>
              </TouchableOpacity>
            </View>
            <>
              { /* display error if necessary */ }
              {errorstate && <Text style={styles.error}>{errorstate}</Text>}
            </>
            <View style={styles.listContainer}>
              <FlatList
                data={chat.messages}
                inverted
                renderItem={({ item }) => (
                  <View style={styles.messageBubble}>
                    <View style={styles.messageContainer}>
                      <View style={styles.messageTextContainer}>
                        <Text style={styles.messageAuthorText}>
                          {item.author.first_name}
                          {' '}
                          {item.author.last_name}
                        </Text>
                        <Text style={styles.message}>{item.message}</Text>
                      </View>
                      <View style={styles.messageOptionsContainer}>
                        <TouchableOpacity style={styles.editMsgButton} onPress={() => navigation.navigate('EditMessageScreen', { messageId: item.message_id, chatId: chatID, initialMessageText: item.message })}>
                          <Text style={styles.deleteButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => this.deleteMessage(item.message_id)}>
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.message_id}
              />
            </View>
          </View>
          <View style={styles.sendContainer}>
            { /* send message textinput and button */ }
            <TextInput
              style={styles.sendMessage}
              placeholder="Send a message..."
              onChangeText={(value) => { this.setState({ messageToSend: value }); }}
              defaultValue={messageToSend}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => this.send(messageToSend)}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={() => this.saveDraft(messageToSend)}>
              <Text style={styles.buttonText}>Save Draft</Text>
            </TouchableOpacity>
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
    width: '18vw',
    height: '10vh',
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
    height: '8vh',
  },
  sendMessage: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    width: '55vw',
  },
  sendButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    margin: 3,
    width: '20vw',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    margin: 3,
    width: '20vw',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
  },
});
