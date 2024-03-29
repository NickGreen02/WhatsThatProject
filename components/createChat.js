import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CreateChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = { chatname: '', errorstate: '' };
    this.createChat = this.createChat.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // create new chat function
  async createChat() {
    const { chatname } = this.state;
    const { navigation } = this.props;

    // create new chat request with chatname from state sent as body
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
        body: JSON.stringify({
          name: chatname,
        }),
      },
    )
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          throw new Error('Invalid request');
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((rJson) => {
        console.log(rJson);
        this.setState({ errorstate: 'New chat created' });
        navigation.navigate('Chats');
      })
      .catch((error) => {
        this.setState({ errorstate: error });
      });
  }

  // render textinput and button for create chat, and display any errors to user
  render() {
    const { errorstate } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.name}
              placeholder="Enter chat name"
              onChangeText={(value) => { this.setState({ chatname: value }); }}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => this.createChat()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create new chat</Text>
              </View>
            </TouchableOpacity>
          </View>

          {errorstate && <Text style={styles.error}>{errorstate}</Text>}

        </View>
      </View>
    );
  }
}

// stylesheet for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
  },
  inputContainer: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#25D366',
    borderRadius: 5,
  },
  name: {
    margin: 10,
    textAlign: 'center',
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
    padding: 10,
  },
});
