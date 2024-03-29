import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class DraftsList extends Component {
  constructor(props) {
    super(props);
    this.state = { drafts: [], isLoading: false, errorstate: '' };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    // set drafts to state from local storage
    AsyncStorage.getItem('whatsthat_draft_messages')
      .then((response) => { this.setState({ drafts: JSON.parse(response) }); });
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

  // send draft message function
  async sendDraft(messageText, chatID) {
    const { navigation } = this.props;
    // send message request with message text from draft list sent as body
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
        // navigate back to chatscreen to show message has been sent
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
        this.setState({ errorstate: error });
      });
  }

  // render drafts list with send draft buttons
  render() {
    const { drafts, isLoading, errorstate } = this.state;
    const { route } = this.props;
    const { chatId } = route.params;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <>
              {errorstate && <Text style={styles.error}>{errorstate}</Text>}
            </>
            <FlatList
              data={drafts}
              renderItem={({ item }) => (
                <View>
                  <Text style={styles.draftMessageText}>{item.draft}</Text>
                  <TouchableOpacity onPress={() => this.sendDraft(item.draft, chatId)}>
                    <View style={styles.sendDraftButton}>
                      <Text style={styles.buttonText}>Send Draft</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
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
    flex: 1,
  },
  draftMessageText: {
    fontSize: 15,
    margin: 5,
  },
  sendDraftButton: {
    justifyContent: 'center',
    backgroundColor: '#25D366',
    marginTop: 2,
    marginBottom: 8,
    margin: 5,
  },
  buttonText: {
    padding: 10,
    color: 'white',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
