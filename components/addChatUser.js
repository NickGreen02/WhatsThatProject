import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Contact from './contact';

export default class AddChatUser extends Component {
  constructor(props) {
    super(props);
    this.state = { contacts: {}, isLoading: false, errorstate: '' };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshContacts = navigation.addListener('focus', () => {
      this.getData();
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.refreshContacts();
  }

  async getData() {
    this.setState({ isLoading: false });
    return fetch(
      'http://localhost:3333/api/1.0.0/contacts',
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
        this.setState({ contacts: rJson, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  async addMember(userID, username) {
    const { navigation, route } = this.props;
    const { chatId } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userID}`,
      {
        method: 'POST',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
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
        this.setState({ isLoading: true });
      })
      .catch((error) => {
        console.log(error);
        const err = String(error);
        if (err.includes('Something went wrong')) {
          this.setState({ errorstate: `${username} is already a member of this chat!` });
        } else {
          this.setState({ errorstate: `${username} has been added to the chat!` });
        }
      });
  }

  render() {
    const { contacts, isLoading, errorstate } = this.state;
    if (isLoading) {
      return (
        <View style={Styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <>
              {errorstate && <Text style={Styles.error}>{errorstate}</Text>}
            </>
            <FlatList
              data={contacts}
              renderItem={({ item }) => (
                <View>
                  <Contact firstname={item.first_name} surname={item.last_name} />
                  <TouchableOpacity onPress={() => this.addMember(item.user_id, `${item.first_name} ${item.last_name}`)}>
                    <View style={Styles.addMemberButton}>
                      <Text style={Styles.buttonText}>Add User</Text>
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
const Styles = StyleSheet.create({
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
  addMemberButton: {
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
  },
});
