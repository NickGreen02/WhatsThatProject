import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class YourProfileApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
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

  // get profile image function
  async get_profile_image() {
    const user = await AsyncStorage.getItem('whatsthat_user_id');
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

  // get logged in user's info using user id from local storage
  async getData() {
    const user = await AsyncStorage.getItem('whatsthat_user_id');
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

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // render user photo, username, email and update profile button
  render() {
    const { navigation } = this.props;
    const { userData, photo } = this.state;
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
          <TouchableOpacity onPress={() => navigation.navigate('UpdateProfile', { data: userData })}>
            <View style={styles.updateButton}>
              <Text style={styles.buttonText}>Update Your Profile</Text>
            </View>
          </TouchableOpacity>
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
    textAlign: 'center',
  },
  updateUserContainer: {
    marginTop: 30,
  },
  updateInput: {
    borderLeftWidth: 'thin',
    borderRightWidth: 'thin',
    borderTopWidth: 'thin',
    borderBottomWidth: 'thin',
    padding: 10,
    margin: 5,
    width: '75vw',
  },
  updateButton: {
    backgroundColor: '#25D366',
    margin: 5,
    marginBottom: 30,
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
