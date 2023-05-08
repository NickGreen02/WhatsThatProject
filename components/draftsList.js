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
    AsyncStorage.getItem('whatsthat_draft_messages')
      .then((response) => { this.setState({ drafts: JSON.parse(response) }); });
    console.log(this.state.drafts);
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

  sendDraft() {
    console.log('send draft test');
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
