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
    this.checkBlocked();
    this.getData();
    console.log('Data displayed');
  }

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

  checkBlocked() {
    const { route } = this.props;
    const { blockNav } = route.params;

    if (blockNav === true) {
      this.setState({ blockCheck: true });
    }
  }

  async removeContact() {
    const { route, navigation } = this.props;
    const { user } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/contact`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ContactScreen');
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

  async blockContact() {
    const { route, navigation } = this.props;
    const { user } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/block`,
      {
        method: 'POST',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ContactScreen');
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

  async unblockContact() {
    const { route, navigation } = this.props;
    const { user } = route.params;
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}/block`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ContactScreen');
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

  render() {
    const { userData, blockCheck } = this.state;
    if (blockCheck) {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <Image />
            <Text style={Styles.name}>
              {userData.first_name}
              {' '}
              {userData.last_name}
            </Text>
            <Text style={Styles.email}>{userData.email}</Text>
            <TouchableOpacity onPress={() => this.removeContact()}>
              <View style={Styles.button}>
                <Text style={Styles.buttonText}>Remove Contact</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.unblockContact()}>
              <View style={Styles.button}>
                <Text style={Styles.buttonText}>Unblock Contact</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={Styles.container}>
          <View style={Styles.formContainer}>
            <Image />
            <Text style={Styles.name}>
              {userData.first_name}
              {' '}
              {userData.last_name}
            </Text>
            <Text style={Styles.email}>{userData.email}</Text>
            <TouchableOpacity onPress={() => this.removeContact()}>
              <View style={Styles.button}>
                <Text style={Styles.buttonText}>Remove Contact</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.blockContact()}>
              <View style={Styles.button}>
                <Text style={Styles.buttonText}>Block Contact</Text>
              </View>
            </TouchableOpacity>
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
