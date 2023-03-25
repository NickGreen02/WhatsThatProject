import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet,
} from 'react-native';
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
  },
  name: {
    fontSize: 20,
  },
  email: {
    fontSize: 15,
  },
});
