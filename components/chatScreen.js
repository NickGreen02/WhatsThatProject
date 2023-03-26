import React, { Component } from 'react';
import {
  View, Text, TextInput, StyleSheet,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatScreenApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: {},
      messageToSend: '',
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const { route } = this.props;
    const { chatID } = route.params;
    const urlTemplate = 'http://localhost:3333/api/1.0.0/chat/';
    const url = urlTemplate.concat(JSON.stringify(chatID));
    return fetch(
      url,
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
        this.setState({ chat: rJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editChat() {
    console.log('chat edited test');
  }

  addUserToChat() {
    console.log('user added to chat test');
  }

  leaveChat() {
    console.log('left chat test');
  }

  async send(messageText) {
    const { route } = this.props;
    const { chatID } = route.params;
    const urlTemplate1 = 'http://localhost:3333/api/1.0.0/chat/';
    const urlTemplate2 = '/message';
    const urlTemplate3 = urlTemplate1.concat(JSON.stringify(chatID));
    const url = urlTemplate3.concat(urlTemplate2);
    console.log(url);
    return fetch(
      url,
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
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { chat, messageToSend } = this.state;
    // const { route } = this.props;
    // const { chatID } = route.params;
    return (
      <View style={Styles.container}>
        <View style={Styles.formContainer}>
          <View style={Styles.optionsContainer}>
            <TouchableOpacity onPress={() => this.editChat()}>
              <View style={Styles.optionButton}>
                <Text style={Styles.optionButtonText}>Edit Chat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.addUserToChat()}>
              <View style={Styles.optionButton}>
                <Text style={Styles.optionButtonText}>Add User</Text>
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
              extraData={chat}
              renderItem={({ item }) => (
                <View style={Styles.messageBubble}>
                  <Text>
                    {item.author.first_name}
                    {' '}
                    {item.author.last_name}
                  </Text>
                  <Text>{item.message}</Text>
                </View>
              )}
              keyExtractor={(item) => item.message_id}
            />
          </View>
        </View>
        <View style={Styles.sendContainer}>
          <TextInput
            style={Styles.sendMessage}
            placeholder="Send a message..."
            onChangeText={(value) => { this.setState({ messageToSend: value }); }}
            defaultValue={messageToSend}
          />
          <TouchableOpacity style={Styles.sendButton} onPress={() => this.send(messageToSend)}>
            <Text style={Styles.buttonText}>Send</Text>
          </TouchableOpacity>
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
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#25D366',
    margin: 5,
    width: '30vw',
  },
  optionButtonText: {
    textAlign: 'center',
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
