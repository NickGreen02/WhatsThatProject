import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UserProfileApp extends Component {
  constructor(props) {
    super(props);
    this.state = { userData: {}, blockCheck: false };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.checkBlocked(); // check if user is blocked
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshProfile = navigation.addListener('focus', () => {
      this.get_profile_image();
      this.getData();
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.refreshProfile();
  }

  // get user info
  async getData() {
    const { route } = this.props;
    const { user } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}`,
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
        this.setState({ userData: rJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // get user profile image
  async get_profile_image() {
    const { route } = this.props;
    const { user } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/photo`,
      {
        method: 'GET',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        return response.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob); // convert blob back to image url
        this.setState({ photo: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // check if blocked by checking if blockNav is true form navigation params
  checkBlocked() {
    const { route } = this.props;
    const { blockNav } = route.params;

    if (blockNav === true) {
      this.setState({ blockCheck: true });
    }
  }

  // remove contact function
  async removeContact() {
    const { route, navigation } = this.props;
    const { user } = route.params;
    // delete request for remove contact using user id from navigation params
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/contact`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ContactScreen'); // navigate to contacts page to show updated contacts list
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
      });
  }

  // block contact function
  async blockContact() {
    const { route, navigation } = this.props;
    const { user } = route.params;
    // post request to block user using user id from navigation params
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/block`,
      {
        method: 'POST',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ContactScreen'); // navigate to contacts page to show updated contacts list
          return response.json();
        } if (response.status === 400) {
          throw new Error('Self-blocking not allowed');
        } if (response.status === 401) {
          throw new Error('Unauthorised');
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
      });
  }

  // unblock contact function
  async unblockContact() {
    const { route, navigation } = this.props;
    const { user } = route.params;
    // delete request to unblock user using user id from navigation params
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/block`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ContactScreen'); // navigate to contacts page to show updated contacts list
          return response.json();
        } if (response.status === 400) {
          throw new Error('Self-blocking not allowed');
        } if (response.status === 401) {
          throw new Error('Unauthorised');
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
      });
  }

  // render user photo, username, user email and buttons for add/remove contact, block/unblock
  render() {
    const { userData, blockCheck, photo } = this.state;
    /* selection statements to check if user is blocked, if they are,
    display a block button, if not, display an unblock button */
    if (blockCheck) {
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Image
              source={{ uri: photo }}
              style={{ width: '50vw', height: '20vh' }}
            />
            <Text style={styles.name}>
              {userData.first_name}
              {' '}
              {userData.last_name}
            </Text>
            <Text style={styles.email}>{userData.email}</Text>
            <Text style={styles.email}>
              {'User ID: '}
              {userData.user_id}
            </Text>
            <TouchableOpacity onPress={() => this.removeContact()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Remove Contact</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.unblockContact()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Unblock Contact</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Image
              source={{ uri: photo }}
              style={{ width: '50vw', height: '20vh' }}
            />
            <Text style={styles.name}>
              {userData.first_name}
              {' '}
              {userData.last_name}
            </Text>
            <Text style={styles.email}>{userData.email}</Text>
            <Text style={styles.email}>
              {'User ID: '}
              {userData.user_id}
            </Text>
            <TouchableOpacity onPress={() => this.removeContact()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Remove Contact</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.blockContact()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Block Contact</Text>
              </View>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#25D366',
    margin: 5,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
  },
  name: {
    fontSize: 20,
  },
  email: {
    fontSize: 15,
  },
});
