// firstnameOriginal: '',
// lastnameOriginal: '',
// passwordOriginal: '',
// emailOriginal: '',

import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TextInput,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originalData: {},
      firstnamechange: '',
      lastnamechange: '',
      passwordchange: '',
      emailchange: '',
      errorstate: '',
    };
  }

  componentDidMount() {
    const { route, navigation } = this.props;
    const { data } = route.params;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.setState({
      originalData: data,
      firstnamechange: data.first_name,
      lastnamechange: data.last_name,
      passwordchange: data.password,
      emailchange: data.email,
    });
    console.log('Initial data set');
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

  async updateInfo() {
    const {
      originalData,
      firstnamechange,
      lastnamechange,
      passwordchange,
      emailchange,
    } = this.state;
    const { navigation } = this.props;

    let data = {};

    if (firstnamechange !== originalData.first_name) {
      data['first_name'] = firstnamechange;
    }

    if (lastnamechange !== originalData.last_name) {
      data['last_name'] = lastnamechange;
    }

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(passwordchange)) {
      this.setState({ errorstate: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
    } else {
      data['password'] = passwordchange;
    }

    if (emailchange !== originalData.emailchange) {
      data['email'] = emailchange;
    }

    console.log(data);

    const user = await AsyncStorage.getItem('whatsthat_user_id');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${user}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
        body: JSON.stringify(data),
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
      firstnamechange,
      lastnamechange,
      passwordchange,
      emailchange,
      errorstate,
    } = this.state;
    return (
      <View style={Styles.container}>
        <View style={Styles.formContainer}>
          <View style={Styles.updateUserContainer}>
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your first name"
              onChangeText={(value) => { this.setState({ firstnamechange: value }); }}
              value={firstnamechange}
            />
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your last name"
              onChangeText={(value) => { this.setState({ lastnamechange: value }); }}
              value={lastnamechange}
            />
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your password"
              onChangeText={(value) => { this.setState({ passwordchange: value }); }}
              value={passwordchange}
            />
            <TextInput
              style={Styles.updateInput}
              placeholder="Change your email address"
              onChangeText={(value) => { this.setState({ emailchange: value }); }}
              value={emailchange}
            />
            <TouchableOpacity onPress={() => this.updateInfo()}>
              <View style={Styles.updateButton}>
                <Text style={Styles.buttonText}>Update Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
          <>
            {errorstate && <Text style={Styles.error}>{errorstate}</Text>}
          </>
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
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
