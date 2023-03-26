import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UserProfileApp extends Component {
  constructor(props) {
    super(props);
    this.state = { userData: {} };
  }

  componentDidMount() {
    this.getData();
    console.log('Data displayed');
  }

  async getData() {
    const { route } = this.props;
    const { user } = route.params;
    const urlTemplate = 'http://localhost:3333/api/1.0.0/user/';
    const url = urlTemplate.concat(JSON.stringify(user));
    return fetch(
      url,
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

  async removeContact() {
    const { route, navigation } = this.props;
    const { user } = route.params;
    const urlTemplate1 = 'http://localhost:3333/api/1.0.0/user/';
    const urlTemplate2 = '/contact';
    const urlTemplate3 = urlTemplate1.concat(JSON.stringify(user));
    const url = urlTemplate3.concat(urlTemplate2);
    console.log(url);
    return fetch(
      url,
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

  render() {
    const { userData } = this.state;
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
        </View>
      </View>
    );
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
