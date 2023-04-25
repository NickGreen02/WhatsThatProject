import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native-web';

import Contact from './contact';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      offset: 0,
      endCheck: false,
      users: {},
      submitted: false,
      errorstate: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { offset } = this.state;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    console.log('Data displayed');
    console.log(`componentDidMount offset: ${offset}`);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  async initialSearch() {
    const { searchString, offset } = this.state;
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=5&offset=0`,
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

        console.log(offset);
        console.log(`http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=5&offset=0`);

        this.setState({ users: newJSON, submitted: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async searchForward() {
    const { searchString, offset, endCheck } = this.state;
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=5&offset=${offset + 5}`,
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
        console.log('ENDCOUNT: ', Object.keys(rJson).length);
        if (Object.keys(rJson).length % 5 !== 0) {
          this.setState({ endCheck: true });
        }
        console.log('ENDCHECK: ', endCheck);
        let newJSON = rJson;
        const loggedInUser = await AsyncStorage.getItem('whatsthat_user_id');

        // remove current logged in user from list of users
        newJSON = newJSON.filter((obj) => parseInt(obj.user_id, 10) !== parseInt(loggedInUser, 10));
        console.log(newJSON);

        console.log(offset);
        console.log(`http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=5&offset=${offset + 5}`);

        this.setState({ users: newJSON, submitted: true, 'offset': offset + 5 });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async searchBackward() {
    const { searchString, offset } = this.state;
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=5&offset=${offset - 5}`,
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
        this.setState({ endCheck: false });
        let newJSON = rJson;
        const loggedInUser = await AsyncStorage.getItem('whatsthat_user_id');

        // remove current logged in user from list of users
        newJSON = newJSON.filter((obj) => parseInt(obj.user_id, 10) !== parseInt(loggedInUser, 10));
        console.log(newJSON);

        console.log(offset);
        console.log(`http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=5&offset=${offset - 5}`);

        this.setState({ users: newJSON, submitted: true, 'offset': offset - 5 });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async addContact(user, username) {
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/contact`,
      {
        method: 'POST',
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
      })
      .catch((error) => {
        console.log(error);
        const err = String(error);
        if (err.includes('Already a contact')) {
          this.setState({ errorstate: `${username} is already in your contacts list!` });
        } else {
          this.setState({ errorstate: `${username} has been added to your contacts list!` });
        }
      });
  }

  render() {
    const {
      searchString,
      users,
      errorstate,
      offset,
      endCheck,
      submitted,
    } = this.state;
    if (submitted && offset === 0) {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
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
              <TouchableOpacity onPress={() => this.initialSearch()}>
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
                  <TouchableOpacity onPress={() => this.addContact(item.user_id, `${item.given_name} ${item.family_name}`)}>
                    <View style={Styles.wideButton}>
                      <Text style={Styles.buttonText}>Add Contact</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
            />
            <TouchableOpacity onPress={() => this.searchForward()}>
              <View style={Styles.wideButton}>
                <Text style={Styles.buttonText}>
                  Next page -
                  {'>'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (submitted && offset !== 0 && endCheck === false) {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
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
              <TouchableOpacity onPress={() => this.initialSearch()}>
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
                  <TouchableOpacity onPress={() => this.addContact(item.user_id, `${item.given_name} ${item.family_name}`)}>
                    <View style={Styles.wideButton}>
                      <Text style={Styles.buttonText}>Add Contact</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
            />
            <View style={Styles.pageNavContainer}>
              <TouchableOpacity onPress={() => this.searchBackward()}>
                <View style={Styles.wideButton}>
                  <Text style={Styles.buttonText}>
                    {'<-'}
                    Previous page
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.searchForward()}>
                <View style={Styles.wideButton}>
                  <Text style={Styles.buttonText}>
                    Next page
                    {'->'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (submitted && offset !== 0 && endCheck === true) {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
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
              <TouchableOpacity onPress={() => this.initialSearch()}>
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
                  <TouchableOpacity onPress={() => this.addContact(item.user_id, `${item.given_name} ${item.family_name}`)}>
                    <View style={Styles.wideButton}>
                      <Text style={Styles.buttonText}>Add Contact</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
            />
            <View style={Styles.pageNavContainer}>
              <TouchableOpacity onPress={() => this.searchBackward()}>
                <View style={Styles.wideButton}>
                  <Text style={Styles.buttonText}>
                    {'<-'}
                    Previous page
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
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
              <TouchableOpacity onPress={() => this.initialSearch()}>
                <View style={Styles.searchButton}>
                  <Text style={Styles.buttonText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text>ENTER SEARCH TERM</Text>
          </View>
        </View>
      );
    }
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
  pageNavContainer: {
    flexDirection: 'row',
  },
  wideButton: {
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#25D366',
    marginTop: 2,
    marginBottom: 8,
    margin: 5,
    bottom: 0,
  },
  navButton: {
    justifyContent: 'center',
    backgroundColor: '#25D366',
    marginTop: 2,
    marginBottom: 8,
    margin: 5,
    bottom: 0,
    width: '45vw',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
