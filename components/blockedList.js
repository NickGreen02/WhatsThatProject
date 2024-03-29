import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import contact component for displaying each user
import Contact from './contact';

export default class ContactListApp extends Component {
  constructor(props) {
    super(props);
    this.state = { blocked: {} };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshContacts = navigation.addListener('focus', () => {
      this.getData(); // get data on component mount
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.refreshContacts();
  }

  // get list of blocked users and store in state
  async getData() {
    return fetch(
      'http://localhost:3333/api/1.0.0/blocked',
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
        this.setState({ blocked: rJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  render() {
    const { blocked } = this.state;
    const { navigation } = this.props;
    // user onclick navigates to the relevant user's profile, showing their profile as a blocked user
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <FlatList
            data={blocked}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('Profile', { user: item.user_id, blockNav: true })}>
                <Contact firstname={item.first_name} surname={item.last_name} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.user_id}
          />
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
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  formContainer: {
  },
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
