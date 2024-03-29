import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EditMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      initialMessage: '',
      messagetext: '',
      errorstate: '',
    };
    this.editMessage = this.editMessage.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // get message text data from navigation params
  getData() {
    const { route } = this.props;
    const { initialMessageText } = route.params;
    // eslint-disable-next-line react/no-unused-state
    this.setState({ initialMessage: initialMessageText });
  }

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // edit message function
  async editMessage() {
    const { messagetext } = this.state;
    const { navigation, route } = this.props;
    const { chatId, messageId } = route.params;

    /* patch request for update message using chat id and message id from navigation params
    and message text from state sent as body */
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
        body: JSON.stringify({
          message: messagetext,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          // if successful, go back a page to the chat screen
          navigation.goBack();
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
        console.log(error);
        this.setState({ errorstate: error });
      });
  }

  // render textinput and button for update message
  render() {
    const { route } = this.props;
    const { initialMessageText } = route.params;
    const { errorstate } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.name}
              placeholder="Edit this message"
              onChangeText={(value) => { this.setState({ messagetext: value }); }}
              defaultValue={initialMessageText}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => this.editMessage()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Edit message</Text>
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
