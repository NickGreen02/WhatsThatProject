import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, TouchableOpacity, FlatList } from 'react-native-web';

import Contact from './contact';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { searchString: '', users: {} };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshUsers = navigation.addListener('focus', () => {
      this.getData();
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.refreshUsers();
  }

  async getData() {
    return fetch(
      'http://localhost:3333/api/1.0.0/search',
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

        this.setState({ users: newJSON });
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

  search() {
    console.log('search function test');
  }

  addContact() {
    console.log('add contact test');
  }

  render() {
    const { searchString, users } = this.state;
    return (
      <View style={Styles.container}>
        <View style={Styles.formContainer}>
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
            data={users}
            renderItem={({ item }) => (
              <View style={Styles.listItemContainer}>
                <Contact firstname={item.given_name} surname={item.family_name} />
                <TouchableOpacity onPress={() => this.addContact(item.user_id)}>
                  <View style={Styles.addContactButton}>
                    <Text style={Styles.buttonText}>Add Contact</Text>
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

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
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
  listItemContainer: {
    alignItems: 'stretch',
    margin: 5,
  },
  addContactButton: {
    justifyContent: 'center',
    backgroundColor: '#25D366',
    marginTop: 2,
    marginBottom: 8,
    margin: 5,
  },
});
