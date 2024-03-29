import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailstate: '', passwordstate: '', errorstate: '', submitted: false,
    };
  }

  // login function to validate input and send login request
  login() {
    const { emailstate, passwordstate } = this.state;

    this.setState({ submitted: true });

    // validation for user data
    if (!(emailstate && passwordstate)) {
      this.setState({ errorstate: 'Please enter an email and a password.' });
      return;
    }
    if (!EmailValidator.validate(emailstate)) {
      this.setState({ errorstate: 'Please enter a valid email address.' });
      return;
    }

    // password regex validation
    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(passwordstate)) {
      this.setState({ errorstate: 'Invalid password.' });
      return;
    }

    const { navigation } = this.props;
    // post request to try login, sending emailstate and passwordstate from state as body
    return fetch(
      'http://localhost:3333/api/1.0.0/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailstate,
          password: passwordstate,
        }),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          throw new Error('Invalid email or password supplied');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(async (rJson) => {
        console.log(rJson);
        // set user id and token in storage if successful
        try {
          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);

          this.setState({ submitted: false });

          navigation.navigate('MainAppNav');
        } catch {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // render email and password textinputs, login button and error display
  render() {
    const {
      emailstate,
      passwordstate,
      errorstate,
      submitted,
    } = this.state;
    const { navigation } = this.props;
    // add selection statements as validation to prevent activityindicator upon error
    if (submitted && errorstate === '') {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else if (submitted && errorstate !== '') {
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.email}>
              <TextInput
                placeholder="Enter email"
                onChangeText={(value) => { this.setState({ emailstate: value }); }}
                value={emailstate}
              />
            </View>

            <View style={styles.password}>
              <TextInput
                placeholder="Enter password"
                secureTextEntry
                onChangeText={(value) => { this.setState({ passwordstate: value }); }}
                value={passwordstate}
              />
            </View>

            <View>
              <TouchableOpacity onPress={() => this.login()}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>No account? Sign up!</Text>
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
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.email}>
              <TextInput
                placeholder="Enter email"
                onChangeText={(value) => { this.setState({ emailstate: value }); }}
                value={emailstate}
              />
            </View>

            <View style={styles.password}>
              <TextInput
                placeholder="Enter password"
                secureTextEntry
                onChangeText={(value) => { this.setState({ passwordstate: value }); }}
                value={passwordstate}
              />
            </View>

            <View>
              <TouchableOpacity onPress={() => this.login()}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>No account? Sign up!</Text>
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
    width: '70vw',
  },
  email: {
    margin: 10,
  },
  password: {
    margin: 10,
  },
  button: {
    backgroundColor: '#25D366',
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
