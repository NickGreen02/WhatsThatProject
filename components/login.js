import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

export default class LoginApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      emailstate: 'nick.green@mmu.ac.uk', passwordstate: 'Wr3xh4m!', errorstate: '', submitted: false,
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    // const reset = this.props.navigation.addListener('focus', () => {
    //   this.setState({email: '', password: '', error: '', submitted: false});
    // });
    // return reset;
  }

  // login function
  login() {
    const { emailstate, passwordstate } = this.state;
    // eslint-disable-next-line react/no-unused-state
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

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(passwordstate)) {
      this.setState({ errorstate: 'Invalid password.' });
      return;
    }

    const { navigation } = this.props;
    // contact the API
    // eslint-disable-next-line consistent-return
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
        try {
          await AsyncStorage.setItem('whatsthat_user_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_session_token', rJson.token);

          // eslint-disable-next-line react/no-unused-state
          this.setState({ submitted: true });

          navigation.navigate('MainAppNav');
        } catch {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // render the page
  render() {
    const { emailstate, passwordstate, errorstate } = this.state;
    const { navigation } = this.props;
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

LoginApp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }),
};

LoginApp.defaultProps = {
  navigation: null,
};
