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

// import contact component for displaying users
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

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // initial search function - called on search button click
  async initialSearch() {
    const { searchString, offset } = this.state;
    // get request for first page of search results (offset set to 0)
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
        // check if the page is the last page, if so set endcheck in state to true
        if (Object.keys(rJson).length % 5 !== 0) {
          this.setState({ endCheck: true });
        }

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
        this.setState({ errorstate: error });
      });
  }

  // search forward function - called on click of next page button
  async searchForward() {
    const { searchString, offset, endCheck } = this.state;
    // get request for get the next 5 results by adding 5 to offset (the next page)
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

        // check if the page is the last page, if so set endcheck in state to true
        if (Object.keys(rJson).length % 5 !== 0 || Object.keys(rJson).length === 0) {
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

        // add to offset in state
        this.setState({ users: newJSON, submitted: true, 'offset': offset + 5 });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errorstate: error });
      });
  }

  // search backward function - called on click of previous page button
  async searchBackward() {
    const { searchString, offset } = this.state;
    // get request for get the last 5 results by subtracting 5 from offset (the previous page)
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
        // set endcheck to false as a previous page cant be the end
        this.setState({ endCheck: false });
        let newJSON = rJson;
        const loggedInUser = await AsyncStorage.getItem('whatsthat_user_id');

        // remove current logged in user from list of users
        newJSON = newJSON.filter((obj) => parseInt(obj.user_id, 10) !== parseInt(loggedInUser, 10));
        console.log(newJSON);

        console.log(offset);
        console.log(`http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=5&offset=${offset - 5}`);

        // subtract from offset in state
        this.setState({ users: newJSON, submitted: true, 'offset': offset - 5 });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errorstate: error });
      });
  }

  // add contact function
  async addContact(user, username) {
    // post request for add contact using user id from json in state
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
        // if user already a contact, display as error
        if (err.includes('Already a contact')) {
          this.setState({ errorstate: `${username} is already in your contacts list!` });
        } else {
          this.setState({ errorstate: `${username} has been added to your contacts list!` });
        }
      });
  }

  // render search page
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
      // if a search has been dont and its the first page, only display a next page button
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <>
              {errorstate && <Text style={styles.error}>{errorstate}</Text>}
            </>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search users"
                onChangeText={(value) => { this.setState({ searchString: value }); }}
                value={searchString}
              />
              <TouchableOpacity onPress={() => this.initialSearch()}>
                <View style={styles.searchButton}>
                  <Text style={styles.buttonText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={users}
              renderItem={({ item }) => (
                <View style={styles.listItemContainer}>
                  <Contact firstname={item.given_name} surname={item.family_name} />
                  <TouchableOpacity onPress={() => this.addContact(item.user_id, `${item.given_name} ${item.family_name}`)}>
                    <View style={styles.wideButton}>
                      <Text style={styles.buttonText}>Add Contact</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
            />
            <TouchableOpacity onPress={() => this.searchForward()}>
              <View style={styles.wideButton}>
                <Text style={styles.buttonText}>
                  Next page -
                  {'>'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (submitted && offset !== 0 && endCheck === false) {
      /* if a search has been done, it isnt the first page and it isnt the end of the results
    then display both next page and previous page buttons */
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <>
              {errorstate && <Text style={styles.error}>{errorstate}</Text>}
            </>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search users"
                onChangeText={(value) => { this.setState({ searchString: value }); }}
                value={searchString}
              />
              <TouchableOpacity onPress={() => this.initialSearch()}>
                <View style={styles.searchButton}>
                  <Text style={styles.buttonText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={users}
              renderItem={({ item }) => (
                <View style={styles.listItemContainer}>
                  <Contact firstname={item.given_name} surname={item.family_name} />
                  <TouchableOpacity onPress={() => this.addContact(item.user_id, `${item.given_name} ${item.family_name}`)}>
                    <View style={styles.wideButton}>
                      <Text style={styles.buttonText}>Add Contact</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
            />
            <View style={styles.pageNavContainer}>
              <TouchableOpacity onPress={() => this.searchBackward()}>
                <View style={styles.wideButton}>
                  <Text style={styles.buttonText}>
                    {'<-'}
                    Previous page
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.searchForward()}>
                <View style={styles.wideButton}>
                  <Text style={styles.buttonText}>
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
      /* if a search has been done, it isnt the first page and it is the end of the results
      display only a previous page button */
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <>
              {errorstate && <Text style={styles.error}>{errorstate}</Text>}
            </>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search users"
                onChangeText={(value) => { this.setState({ searchString: value }); }}
                value={searchString}
              />
              <TouchableOpacity onPress={() => this.initialSearch()}>
                <View style={styles.searchButton}>
                  <Text style={styles.buttonText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={users}
              renderItem={({ item }) => (
                <View style={styles.listItemContainer}>
                  <Contact firstname={item.given_name} surname={item.family_name} />
                  <TouchableOpacity onPress={() => this.addContact(item.user_id, `${item.given_name} ${item.family_name}`)}>
                    <View style={styles.wideButton}>
                      <Text style={styles.buttonText}>Add Contact</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.user_id}
            />
            <View style={styles.pageNavContainer}>
              <TouchableOpacity onPress={() => this.searchBackward()}>
                <View style={styles.wideButton}>
                  <Text style={styles.buttonText}>
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
      // otherwise display blank search page with a search prompt
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <>
              {errorstate && <Text style={styles.error}>{errorstate}</Text>}
            </>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search users"
                onChangeText={(value) => { this.setState({ searchString: value }); }}
                value={searchString}
              />
              <TouchableOpacity onPress={() => this.initialSearch()}>
                <View style={styles.searchButton}>
                  <Text style={styles.buttonText}>Search</Text>
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

// stylesheet for the page
const styles = StyleSheet.create({
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
