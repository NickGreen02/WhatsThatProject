import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import Contact from './contact';

export default class ContactListApp extends Component {
  constructor(props) {
    super(props);
    this.state = { contacts: {} };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.refreshChats = navigation.addListener('focus', () => {
      this.getData();
    });
    console.log('Data displayed');
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.refreshChats();
  }

  async getData() {
    return fetch(
      'http://localhost:3333/api/1.0.0/contacts',
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
        this.setState({ contacts: rJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  render() {
    const { contacts } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <FlatList
            data={contacts}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Contact firstname={item.first_name} surname={item.last_name} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.user_id}
          />
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
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  formContainer: {
  },
  error: {
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});

ContactListApp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }),
};

ContactListApp.defaultProps = {
  navigation: null,
};
