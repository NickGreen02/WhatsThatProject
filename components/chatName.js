import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatNameApp extends Component {
  constructor(props) {
    super(props);
    this.state = { chatname: '', errorstate: '' };
    this.editChat = this.editChat.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    console.log('Data displayed');
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

  // edit chat name function
  async editChat() {
    const { chatname } = this.state;
    const { navigation, route } = this.props;
    const { chatId } = route.params;

    // patch request for change chat name, send chatname from state as body
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
        body: JSON.stringify({
          name: chatname,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ChatList'); // if successful, navigate to chat list which shows updated chat name
          return response.json();
        } if (response.status === 400) {
          throw new Error('Bad request');
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
        console.log(error);
        this.setState({ errorstate: error });
      });
  }

  // render a text input and update button for changing chat name
  render() {
    const { errorstate } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.name}
              placeholder="Enter new chat name"
              onChangeText={(value) => { this.setState({ chatname: value }); }}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => this.editChat()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Change chat name</Text>
              </View>
            </TouchableOpacity>
          </View>
          <>
            { /* display error if necessary */ }
            {errorstate && <Text style={styles.error}>{errorstate}</Text>}
          </>
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
