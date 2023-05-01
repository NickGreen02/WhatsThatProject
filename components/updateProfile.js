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

  // set initial data to state from navigation params
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

  // check if logged in, if not, send back to login screen
  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null || value === '') {
      navigation.navigate('Login');
    }
  };

  // update info function
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

    // check if each field has changed, if it has, change the value in the object
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
    // patch request sending new user data object as body
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
          navigation.goBack(); // navigate back to profile page to show updated info
          return response.json();
        } if (response.status === 400) {
          throw new Error('Bad request');
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
        this.setState({ errorstate: error });
      });
  }

  // render the 4 textinputs and an update button
  render() {
    const {
      firstnamechange,
      lastnamechange,
      passwordchange,
      emailchange,
      errorstate,
    } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.updateUserContainer}>
            <TextInput
              style={styles.updateInput}
              placeholder="Change your first name"
              onChangeText={(value) => { this.setState({ firstnamechange: value }); }}
              value={firstnamechange}
            />
            <TextInput
              style={styles.updateInput}
              placeholder="Change your last name"
              onChangeText={(value) => { this.setState({ lastnamechange: value }); }}
              value={lastnamechange}
            />
            <TextInput
              style={styles.updateInput}
              placeholder="Change your password"
              onChangeText={(value) => { this.setState({ passwordchange: value }); }}
              value={passwordchange}
            />
            <TextInput
              style={styles.updateInput}
              placeholder="Change your email address"
              onChangeText={(value) => { this.setState({ emailchange: value }); }}
              value={emailchange}
            />
            <TouchableOpacity onPress={() => this.updateInfo()}>
              <View style={styles.updateButton}>
                <Text style={styles.buttonText}>Update Profile</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TakePhoto')}>
              <View style={styles.updateButton}>
                <Text style={styles.buttonText}>Add Profile Photo</Text>
              </View>
            </TouchableOpacity>
          </View>
          <>
            { /* display error if necessary */ }
            {errorstate && <Text style={styles.error}>{errorstate}</Text>}
          </>
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
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
