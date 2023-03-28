import React, { Component } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class YourProfileApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      firstnamechange: '',
      lastnamechange: '',
      passwordchange: '',
      emailchange: '',
    };
  }

  componentDidMount() {
    this.getData();
    console.log('Data displayed');
  }

  async getData() {
    const user = await AsyncStorage.getItem('whatsthat_user_id');
    const urlTemplate = 'http://localhost:3333/api/1.0.0/user/';
    const url = urlTemplate.concat(user);
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

  async changeFirstName() {
    const { firstnamechange } = this.state;
    const { navigation } = this.props;
    const user = await AsyncStorage.getItem('whatsthat_user_id');
    const urlTemplate = 'http://localhost:3333/api/1.0.0/user/';
    const url = urlTemplate.concat(user);
    return fetch(
      url,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify({
          first_name: firstnamechange,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ChatList');
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
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

  async changeLastName() {
    const { lastnamechange } = this.state;
    const { navigation } = this.props;
    const user = await AsyncStorage.getItem('whatsthat_user_id');
    const urlTemplate = 'http://localhost:3333/api/1.0.0/user/';
    const url = urlTemplate.concat(user);
    return fetch(
      url,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify({
          last_name: lastnamechange,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ChatList');
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
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

  async changePassword() {
    const { passwordchange } = this.state;
    const { navigation } = this.props;
    const user = await AsyncStorage.getItem('whatsthat_user_id');
    const urlTemplate = 'http://localhost:3333/api/1.0.0/user/';
    const url = urlTemplate.concat(user);
    return fetch(
      url,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify({
          password: passwordchange,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ChatList');
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
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

  async changeEmail() {
    const { emailchange } = this.state;
    const { navigation } = this.props;
    const user = await AsyncStorage.getItem('whatsthat_user_id');
    const urlTemplate = 'http://localhost:3333/api/1.0.0/user/';
    const url = urlTemplate.concat(user);
    return fetch(
      url,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify({
          email: emailchange,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('ChatList');
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised access');
        } if (response.status === 403) {
          throw new Error('Forbidden by server');
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
    const {
      userData,
      firstnamechange,
      lastnamechange,
      passwordchange,
      emailchange,
    } = this.state;
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
          <View style={Styles.updateUserContainer}>
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your first name"
              onChangeText={(value) => { this.setState({ firstnamechange: value }); }}
              value={firstnamechange}
            />
            <TouchableOpacity onPress={() => this.changeFirstName()}>
              <View style={Styles.updateButton}>
                <Text style={Styles.buttonText}>Update</Text>
              </View>
            </TouchableOpacity>
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your last name"
              onChangeText={(value) => { this.setState({ lastnamechange: value }); }}
              value={lastnamechange}
            />
            <TouchableOpacity onPress={() => this.changeLastName()}>
              <View style={Styles.updateButton}>
                <Text style={Styles.buttonText}>Update</Text>
              </View>
            </TouchableOpacity>
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your password"
              onChangeText={(value) => { this.setState({ passwordchange: value }); }}
              value={passwordchange}
            />
            <TouchableOpacity onPress={() => this.changePassword()}>
              <View style={Styles.updateButton}>
                <Text style={Styles.buttonText}>Update</Text>
              </View>
            </TouchableOpacity>
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your email address"
              onChangeText={(value) => { this.setState({ emailchange: value }); }}
              value={emailchange}
            />
            <TouchableOpacity onPress={() => this.changeEmail()}>
              <View style={Styles.updateButton}>
                <Text style={Styles.buttonText}>Update</Text>
              </View>
            </TouchableOpacity>
          </View>
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
