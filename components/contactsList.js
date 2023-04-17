import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ActivityIndicator,
} from 'react-native';
import { TextInput, FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Contact from './contact';

export default class ContactListApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      offset: 0,
      contacts: {},
      isLoading: true,
      submitted: false,
      errorstate: '',
    };
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
    this.setState({ submitted: false });
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

  async search() {
    const { searchString, offset } = this.state;
    this.setState({ submitted: true });
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=contacts&limit=20&offset=${offset}`,
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
      .then(async (rJson) => {
        console.log(rJson);
        let newJSON = rJson;
        const loggedInUser = await AsyncStorage.getItem('whatsthat_user_id');

        // remove current logged in user from list of users
        newJSON = newJSON.filter((obj) => parseInt(obj.user_id, 10) !== parseInt(loggedInUser, 10));
        console.log(newJSON);

        this.setState({ contacts: newJSON });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      searchString,
      contacts,
      errorstate,
      isLoading,
      submitted,
    } = this.state;
    const { navigation } = this.props;
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else if (!submitted && !isLoading) {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <View style={Styles.optionsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Blocked')}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Blocked Users</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Search Contacts</Text>
                </View>
              </TouchableOpacity>
            </View>
            <>
              {errorstate && <Text style={Styles.error}>{errorstate}</Text>}
            </>
            <View style={Styles.searchContainer}>
              <TextInput
                style={Styles.searchBar}
                placeholder="Search users"
                onChangeText={(value) => { this.setState({ searchString: value }); }}
                value={searchString}
              />
              <TouchableOpacity onPress={() => this.search()}>
                <View style={Styles.searchButton}>
                  <Text style={Styles.buttonText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={contacts}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: item.user_id, blockNav: false })}>
                  <Contact firstname={item.first_name} surname={item.last_name} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.user_id}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <View style={Styles.optionsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Blocked')}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Blocked Users</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <View style={Styles.optionButton}>
                  <Text style={Styles.optionButtonText}>Search Contacts</Text>
                </View>
              </TouchableOpacity>
            </View>
            <>
              {errorstate && <Text style={Styles.error}>{errorstate}</Text>}
            </>
            <View style={Styles.searchContainer}>
              <TextInput
                style={Styles.searchBar}
                placeholder="Search users"
                onChangeText={(value) => { this.setState({ searchString: value }); }}
                value={searchString}
              />
              <TouchableOpacity onPress={() => this.search()}>
                <View style={Styles.searchButton}>
                  <Text style={Styles.buttonText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={contacts}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: item.user_id, blockNav: false })}>
                  <Contact firstname={item.given_name} surname={item.family_name} />
                </TouchableOpacity>
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
    width: '45vw',
  },
  optionButtonText: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  searchBar: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    padding: 10,
    margin: 5,
    width: '75vw',
  },
  searchButton: {
    backgroundColor: '#25D366',
    margin: 5,
    width: '20vw',
    justifyContent: 'center',
    alignItems: 'center',
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
