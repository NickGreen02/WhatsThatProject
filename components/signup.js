import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet, ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import * as EmailValidator from 'email-validator';

export default class SignupApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '', surname: '', emailstate: '', passwordstate: '', errorstate: '', submitted: false,
    };
    this.signup = this.signup.bind(this);
  }

  // signup function
  signup() {
    const {
      emailstate, passwordstate, firstname, surname,
    } = this.state;
    // eslint-disable-next-line react/no-unused-state
    this.setState({ submitted: true });

    // validation for user data
    if (!(firstname && surname)) {
      this.setState({ errorstate: 'Please enter a first name and a surname.' });
      return;
    }
    if (!(emailstate && passwordstate)) {
      this.setState({ errorstate: 'Please enter an email and a password.' });
      return;
    }
    if (!EmailValidator.validate(emailstate)) {
      this.setState({ errorstate: 'Please enter a valid email address.' });
      return;
    }

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(passwordstate)) {
      this.setState({ errorstate: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
      return;
    }

    const { navigation } = this.props;
    // contact the API
    // eslint-disable-next-line consistent-return
    return fetch(
      'http://localhost:3333/api/1.0.0/user',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstname,
          last_name: surname,
          email: emailstate,
          password: passwordstate,
        }),
      },
    )
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          throw new Error("Email already exists or password isn't strong enough.");
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((rJson) => {
        console.log(rJson);
        this.setState({ errorstate: 'User added successfully' });
        this.setState({ submitted: false });
        navigation.navigate('Login');
      })
      .catch((error) => {
        this.setState({ errorstate: error });
      });
  }

  // render the page
  render() {
    const {
      emailstate,
      passwordstate,
      firstname,
      surname,
      errorstate,
      submitted,
    } = this.state;
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
            <View style={styles.firstname}>
              <TextInput
                placeholder="Enter first name"
                onChangeText={(value) => { this.setState({ firstname: value }); }}
                value={firstname}
              />
            </View>

            <View style={styles.surname}>
              <TextInput
                placeholder="Enter surname"
                onChangeText={(value) => { this.setState({ surname: value }); }}
                value={surname}
              />
            </View>

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
              <TouchableOpacity onPress={() => this.signup()}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </View>
              </TouchableOpacity>
            </View>
            <>
              {errorstate && <Text style={styles.error}>{errorstate}</Text>}
            </>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.firstname}>
              <TextInput
                placeholder="Enter first name"
                onChangeText={(value) => { this.setState({ firstname: value }); }}
                value={firstname}
              />
            </View>

            <View style={styles.surname}>
              <TextInput
                placeholder="Enter surname"
                onChangeText={(value) => { this.setState({ surname: value }); }}
                value={surname}
              />
            </View>

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
              <TouchableOpacity onPress={() => this.signup()}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </View>
              </TouchableOpacity>
            </View>
            <>
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
  firstname: {
    margin: 10,
  },
  surname: {
    margin: 10,
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
    padding: 10,
  },
});
